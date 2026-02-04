import * as fs from 'fs';
import * as path from 'path';

interface OpenApiSchema {
  type?: string;
  enum?: any[];
  $ref?: string;
  properties?: Record<string, OpenApiSchema>;
  additionalProperties?: boolean | OpenApiSchema;
  required?: string[];
  items?: OpenApiSchema;
  allOf?: OpenApiSchema[];
  oneOf?: OpenApiSchema[];
  anyOf?: OpenApiSchema[];
}

interface OpenApiOperation {
  summary?: string;
  operationId?: string;
  tags?: string[];
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    schema?: OpenApiSchema;
  }>;
  requestBody?: {
    content?: {
      'application/json'?: { schema?: OpenApiSchema };
    };
  };
  responses?: Record<string, {
    content?: {
      'application/json'?: { schema?: OpenApiSchema };
    };
  }>;
}

interface OpenApiSpec {
  components: { schemas: Record<string, OpenApiSchema> };
  paths: Record<string, Record<string, OpenApiOperation>>;
}

export class OpenApiSdkGenerator {
  private spec: OpenApiSpec;
  private typeMappers = new Map([
    ['string', () => 'string'],
    ['integer', () => 'number'],
    ['number', () => 'number'],
    ['boolean', () => 'boolean'],
    ['array', (schema: OpenApiSchema) => `${this.resolveType(schema.items!)}[]`],
    ['object', (schema: OpenApiSchema) => this.buildObjectType(schema)]
  ]);

  constructor(private specPath: string, private typesDir: string, private apiDir: string) {
    this.spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  }

  generate(): void {
    this.generateTypes();
    this.generateApi();
    this.generateIndexes();
  }

  private generateIndexes(): void {
    this.generateIndex(this.typesDir);
    this.generateIndex(path.dirname(this.typesDir) + '/utils', ['generator.ts', 'keyGenerator.ts', 'version.ts']);
  }

  private generateIndex(dir: string, exclude: string[] = []): void {
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.ts') && f !== 'index.ts' && !exclude.includes(f))
      .map(f => f.replace('.ts', ''))
      .sort();

    const content = files.map(f => `export * from './${f}.js';`).join('\n') + '\n';
    fs.writeFileSync(path.join(dir, 'index.ts'), content);
    console.log(`Generated ${path.basename(dir)}/index.ts (${files.length} exports)`);
  }

  private generateTypes(): void {
    this.prepareDirectory(this.typesDir, '.ts');

    Object.entries(this.spec.components.schemas).forEach(([name, schema]) =>
      fs.writeFileSync(
        path.join(this.typesDir, `${name}.ts`),
        this.generateTypeDefinition(name, schema) + '\n'
      )
    );
  }

  private generateApi(): void {
    this.prepareDirectory(this.apiDir, '.ts');

    const fileData: Record<string, {
      types: Set<string>;
      methods: string[];
    }> = {};

    Object.entries(this.spec.paths).forEach(([route, methods]) =>
      Object.entries(methods).forEach(([method, op]) => {
        if (!op.summary) return;
        const fileName = this.getFileName(op);
        if (!fileData[fileName]) fileData[fileName] = { types: new Set(), methods: [] };

        const { paramType, paramOptional, pathParams, isQueryInterface } = this.processParameters(op, route, method);
        const returnType = this.getReturnType(op);

        if (isQueryInterface) this.saveQueryInterface(paramType);
        if (returnType) fileData[fileName].types.add(returnType);
        if (this.isRefType(paramType) || isQueryInterface) fileData[fileName].types.add(paramType);

        fileData[fileName].methods.push(
          this.generateMethod(this.toCamelCase(op.summary).replace(/ID/g, 'Id'), method, route, paramType, paramOptional, returnType, pathParams, op)
        );
      })
    );

    Object.entries(fileData).forEach(([fileName, data]) =>
      fs.writeFileSync(
        path.join(this.apiDir, `${fileName}.ts`),
        this.generateApiFile(fileName, { types: data.types, methods: data.methods })
      )
    );
  }

  private generateTypeDefinition(name: string, schema: OpenApiSchema): string {
    const imports = this.collectImports(schema);
    const importsStr = imports.length > 0 ? imports.map(imp => `import { ${imp} } from './${imp}.js';`).join('\n') + '\n\n' : '';

    if (schema.enum) return `${importsStr}export type ${name} = ${schema.enum.map(v => JSON.stringify(v)).join(' | ')};`;
    if (schema.allOf?.length === 1 && schema.allOf[0].$ref) return `${importsStr}export type ${name} = ${this.extractRefName(schema.allOf[0].$ref)};`;
    if (schema.$ref) return `${importsStr}export type ${name} = ${this.extractRefName(schema.$ref)};`;
    if (this.isEmptyObject(schema)) return `${importsStr}export type ${name} = Record<string, any>;`;
    if (schema.type === 'object' || schema.properties) return `${importsStr}${this.generateInterface(name, schema)}`;
    return `${importsStr}export type ${name} = any;`;
  }

  private generateInterface(name: string, schema: OpenApiSchema): string {
    const required = schema.required || [];
    const properties = Object.entries(schema.properties || {})
      .map(([propName, propSchema]) =>
        `  ${propName}${required.includes(propName) ? '' : '?'}: ${this.resolveType(propSchema)};`)
      .join('\n');
    return `export interface ${name} {\n${properties}\n}`;
  }

  private processParameters(op: OpenApiOperation, route?: string, method?: string): {
    paramType: string;
    paramOptional: string;
    pathParams?: Array<{ name: string, required: boolean }>;
    isQueryInterface?: boolean
  } {
    const isWorkspaceGetEndpoint = method === 'get' && route === '/workspaces/{workspaceId}';
    const pathParams = op.parameters?.filter(p => p.in === 'path' && (isWorkspaceGetEndpoint || p.name !== 'workspaceId')).map(p => ({
      name: p.name,
      required: p.required || false
    })) || [];
    const queryParams = op.parameters?.filter(p => p.in === 'query') || [];

    if (isWorkspaceGetEndpoint) {
      return { paramType: 'string', paramOptional: '?', pathParams };
    }

    if (op.requestBody?.content?.['application/json']?.schema) {
      const schema = op.requestBody.content['application/json'].schema;
      if (schema.$ref) {
        return {
          paramType: this.extractRefName(schema.$ref),
          paramOptional: '',
          pathParams
        };
      }
      if (schema.type === 'object' && schema.properties) {
        const interfaceName = this.getInterfaceName(op, 'Request');
        return {
          paramType: interfaceName,
          paramOptional: this.areAllFieldsOptional(schema) ? '?' : '',
          pathParams
        };
      }
    }

    if (queryParams.length && !pathParams.length) {
      const interfaceName = this.getInterfaceName(op, 'Query');
      return {
        paramType: interfaceName,
        paramOptional: '?',
        pathParams,
        isQueryInterface: true
      };
    }

    if (queryParams.length && pathParams.length) {
      const interfaceName = this.getInterfaceName(op, 'Params');
      return {
        paramType: interfaceName,
        paramOptional: '',
        pathParams
      };
    }

    return { paramType: 'any', paramOptional: '?', pathParams };
  }

  private generateMethod(funcName: string, method: string, route: string, paramType: string, paramOptional: string, returnType?: string, pathParams?: Array<{
    name: string,
    required: boolean
  }>, op?: OpenApiOperation): string {
    const hasRequestBody = op?.requestBody?.content?.['application/json']?.schema;
    const hasPathParams = pathParams && pathParams.length > 0;
    const isWorkspaceGetEndpoint = method === 'get' && route === '/workspaces/{workspaceId}';

    if (hasRequestBody && hasPathParams) {
      const pathArgs = pathParams.map(p => `${p.name}: string`).join(', ');
      const pathExpr = route.replace(/{(\w+)}/g, (_, p1) =>
        (p1 === 'workspaceId' && !isWorkspaceGetEndpoint) ? '${this.workspaceId}' : `\${${p1}}`
      );

      const args = [`method: "${method.toUpperCase()}"`, `path: \`${pathExpr}\``, 'body'];
      const methodBody = `return this.http.request${returnType ? `<${returnType}>` : ''}({\n      ${args.join(',\n      ')}\n    });`;
      const signature = `async ${funcName}(${pathArgs}, body${paramOptional}: ${paramType})${returnType ? `: Promise<${returnType}>` : ''}`;

      return `  ${signature} {\n    ${methodBody}\n  }`;
    }

    if (!hasRequestBody && hasPathParams) {
      const pathArgs = pathParams.map(p => `${p.name}${isWorkspaceGetEndpoint ? '?' : ''}: string`).join(', ');
      const pathExpr = route.replace(/{(\w+)}/g, (_, p1) =>
        (p1 === 'workspaceId' && !isWorkspaceGetEndpoint) ? '${this.workspaceId}' : (p1 === 'workspaceId' ? `\${${p1} || this.workspaceId}` : `\${${p1}}`)
      );

      const args = [`method: "${method.toUpperCase()}"`, `path: \`${pathExpr}\``];
      const methodBody = `return this.http.request${returnType ? `<${returnType}>` : ''}({\n      ${args.join(',\n      ')}\n    });`;
      const signature = `async ${funcName}(${pathArgs})${returnType ? `: Promise<${returnType}>` : ''}`;

      return `  ${signature} {\n    ${methodBody}\n  }`;
    }

    const pathExpr = route.replace(/{(\w+)}/g, (_, p1) =>
      (p1 === 'workspaceId' && !isWorkspaceGetEndpoint) ? '${this.workspaceId}' :
        isWorkspaceGetEndpoint ? `\${${p1} || this.workspaceId}` : `\${params.${p1}}`
    );

    const args = [`method: "${method.toUpperCase()}"`, `path: \`${pathExpr}\``];
    if (paramType !== 'any') {
      const argName = hasRequestBody ? 'body' : (['get', 'delete'].includes(method) ? 'query' : 'body');
      args.push(argName);
    }

    const methodBody = `return this.http.request${returnType ? `<${returnType}>` : ''}({\n      ${args.join(',\n      ')}\n    });`;
    const paramName = isWorkspaceGetEndpoint ? 'workspaceId' : (hasRequestBody ? 'body' : 'query');
    const signature = paramType === 'any'
      ? `async ${funcName}()${returnType ? `: Promise<${returnType}>` : ''}`
      : `async ${funcName}(${paramName}${paramOptional}: ${paramType})${returnType ? `: Promise<${returnType}>` : ''}`;

    return `  ${signature} {\n    ${methodBody}\n  }`;
  }

  private generateApiFile(fileName: string, data: { types: Set<string>; methods: string[] }): string {
    const imports = [
      ...Array.from(data.types).map(type => `import { ${type} } from "../types/${type}.js";`),
      'import { HttpClient } from "../utils/http.js";'
    ].join('\n');

    const className = `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}API`;

    return [
      imports + '\n',
      `export class ${className} {\n`,
      '  constructor(private http: HttpClient, private workspaceId?: string) {}\n',
      data.methods.join('\n\n'),
      '}'
    ].filter(Boolean).join('\n');
  }

  private saveQueryInterface(interfaceName: string): void {
    for (const [route, methods] of Object.entries(this.spec.paths)) {
      for (const [method, op] of Object.entries(methods as any)) {
        if (this.getInterfaceName(op as any, 'Query') === interfaceName) {
          const queryParams = (op as any).parameters?.filter((p: any) => p.in === 'query') || [];

          if (queryParams.length) {
            const fields = queryParams.map((p: any) => `  ${p.name}${p.required ? '' : '?'}: ${this.getParameterType(p.schema)};`).join('\n');
            const interfaceContent = `export interface ${interfaceName} {\n${fields}\n}`;

            fs.writeFileSync(
              path.join(this.typesDir, `${interfaceName}.ts`),
              interfaceContent + '\n'
            );
          }
          return;
        }
      }
    }
  }

  private resolveType(schema: OpenApiSchema, seen = new Set<string>()): string {
    if (schema.$ref) {
      const refName = this.extractRefName(schema.$ref);
      if (seen.has(refName)) return refName;
      seen.add(refName);
      return refName;
    }
    if (schema.enum) return schema.enum.map(v => JSON.stringify(v)).join(' | ');

    const mapper = this.typeMappers.get(schema.type || 'unknown');
    return mapper ? mapper(schema) : 'any';
  }

  private buildObjectType(schema: OpenApiSchema): string {
    if (!schema.properties) {
      const valueType = schema.additionalProperties === true ? 'any'
        : schema.additionalProperties ? this.resolveType(schema.additionalProperties) : 'any';
      return `Record<string, ${valueType}>`;
    }

    const required = schema.required || [];
    return '{ ' + Object.entries(schema.properties)
      .map(([key, prop]) => `${key}${required.includes(key) ? '' : '?'}: ${this.resolveType(prop)}`)
      .join('; ') + ' }';
  }

  private prepareDirectory(dir: string, extension: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    } else {
      fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith(extension))
        .forEach(dirent => fs.unlinkSync(path.join(dir, dirent.name)));
    }
  }

  private getFileName(op: OpenApiOperation): string {
    return op.tags?.length ? this.toCamelCase(op.tags[0]) : 'misc';
  }

  private getReturnType(op: OpenApiOperation): string | undefined {
    const schema = (op.responses?.['200'] || op.responses?.['201'])?.content?.['application/json']?.schema;
    return schema?.$ref ? this.extractRefName(schema.$ref) : undefined;
  }

  private getInterfaceName(op: OpenApiOperation, suffix: string): string {
    return op.operationId
      ? `${this.toPascalCase(op.operationId)}${suffix}`
      : `${this.toPascalCase(op.summary!.replace(/^(Get|Create|Update|Delete|Retrieve|Post|Put|Patch|Remove|Deactivate)\s+/i, ''))}${suffix}`;
  }

  private generateLocalInterface(name: string, schema: OpenApiSchema): string {
    const required = schema.required || [];
    const fields = Object.entries(schema.properties || {})
      .map(([prop, propSchema]) => `  ${prop}${required.includes(prop) ? '' : '?'}: ${this.getParameterType(propSchema)};`)
      .join('\n');
    return `export interface ${name} {\n${fields}\n}\n`;
  }

  private getParameterType(schema?: OpenApiSchema): string {
    if (!schema) return 'any';
    if (schema.type === 'array') return 'string[]';
    if (schema.type === 'string') return 'string';
    if (schema.type === 'integer' || schema.type === 'number') return 'number';
    if (schema.type === 'boolean') return 'boolean';
    return 'any';
  }

  private areAllFieldsOptional(schema: OpenApiSchema): boolean {
    return !schema.required?.length || Object.keys(schema.properties || {}).every(key => !schema.required!.includes(key));
  }

  private areInterfaceFieldsOptional(interfaceDef: string): boolean {
    const fields = interfaceDef.split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('export interface') && l !== '}');
    return fields.length === 0 || fields.every(l => l.includes('?:'));
  }

  private isRefType(paramType: string): boolean {
    const primitiveTypes = ['string', 'number', 'boolean', 'any'];
    return !primitiveTypes.includes(paramType) && !paramType.endsWith('Params') && !paramType.endsWith('Request');
  }

  private isEmptyObject(schema: OpenApiSchema): boolean {
    return (schema.type === 'object' || !!schema.properties || !!schema.additionalProperties) &&
      (!schema.properties || Object.keys(schema.properties).length === 0) &&
      (!schema.additionalProperties || schema.additionalProperties === true);
  }

  private extractRefName(ref: string): string {
    return ref.split('/').pop()!;
  }

  private toCamelCase(str: string): string {
    return str.replace(/[-_ ]+(.)/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, c => c.toLowerCase());
  }

  private toPascalCase(str: string): string {
    return str.replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, (_, __, c) => c ? c.toUpperCase() : '')
      .replace(/[^a-zA-Z0-9]/g, '');
  }

  private collectImports(schema: OpenApiSchema, collected = new Set<string>()): string[] {
    if (schema.$ref) {
      const refName = this.extractRefName(schema.$ref);
      collected.add(refName);
    }

    if (schema.properties) {
      Object.values(schema.properties).forEach(prop => this.collectImports(prop, collected));
    }

    if (schema.items) {
      this.collectImports(schema.items, collected);
    }

    if (schema.allOf) {
      schema.allOf.forEach(s => this.collectImports(s, collected));
    }

    if (schema.oneOf) {
      schema.oneOf.forEach(s => this.collectImports(s, collected));
    }

    if (schema.anyOf) {
      schema.anyOf.forEach(s => this.collectImports(s, collected));
    }

    return Array.from(collected);
  }
}

new OpenApiSdkGenerator(
  'bron-open-api-public.json',
  'src/types',
  'src/api'
).generate();
