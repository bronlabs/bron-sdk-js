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
}

interface OpenApiSpec {
  components: { schemas: Record<string, OpenApiSchema> };
}

class OpenApiGeneratorBuilder {
  private config = {
    specPath: '',
    outputDir: '',
    typeMappers: new Map<string, (schema: OpenApiSchema, resolver: (s: OpenApiSchema) => string) => string>([
      ['string', () => 'string'],
      ['integer', () => 'number'],
      ['number', () => 'number'],
      ['boolean', () => 'boolean'],
      ['array', (schema, resolve) => `${resolve(schema.items!)}[]`],
      ['object', (schema, resolve) => this.buildObjectType(schema, resolve)]
    ]),
    fileExtension: '.ts',
    cleanOutput: true
  };

  fromSpec(path: string): this {
    this.config.specPath = path;
    return this;
  }

  toDirectory(dir: string): this {
    this.config.outputDir = dir;
    return this;
  }

  build(): OpenApiGenerator {
    if (!this.config.specPath || !this.config.outputDir) {
      throw new Error('Spec path and output directory are required');
    }
    return new OpenApiGenerator(this.config);
  }

  private buildObjectType(schema: OpenApiSchema, resolve: (s: OpenApiSchema) => string): string {
    if (!schema.properties) {
      const valueType = schema.additionalProperties === true ? 'any'
        : schema.additionalProperties ? resolve(schema.additionalProperties) : 'any';
      return `Record<string, ${valueType}>`;
    }

    const required = schema.required || [];
    return '{ ' + Object.entries(schema.properties)
      .map(([key, prop]) => `${key}${required.includes(key) ? '' : '?'}: ${resolve(prop)}`)
      .join('; ') + ' }';
  }
}

class OpenApiGenerator {
  private readonly schemas: Record<string, OpenApiSchema>;

  constructor(private config: any) {
    this.schemas = this.loadSchemas();
  }

  generate(): void {
    this.prepareOutput();
    Object.entries(this.schemas).forEach(([name, schema]) =>
      this.writeTypeFile(name, this.generateType(name, schema)));
  }

  private loadSchemas(): Record<string, OpenApiSchema> {
    const spec: OpenApiSpec = JSON.parse(fs.readFileSync(this.config.specPath, 'utf-8'));
    return spec.components.schemas;
  }

  private prepareOutput(): void {
    if (!this.config.cleanOutput) return;

    if (fs.existsSync(this.config.outputDir)) {
      fs.readdirSync(this.config.outputDir, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && dirent.name.endsWith(this.config.fileExtension))
        .forEach(dirent => fs.unlinkSync(path.join(this.config.outputDir, dirent.name)));
    } else {
      fs.mkdirSync(this.config.outputDir);
    }
  }

  private generateType(name: string, schema: OpenApiSchema): string {
    if (schema.enum) return `export type ${name} = ${this.resolveEnum(schema.enum)};`;
    if (schema.allOf?.length === 1 && schema.allOf[0].$ref) return `export type ${name} = ${this.extractRefName(schema.allOf[0].$ref)};`;
    if (schema.$ref) return `export type ${name} = ${this.extractRefName(schema.$ref)};`;
    if (this.isEmptyObject(schema)) return `export type ${name} = Record<string, any>;`;
    if (schema.type === 'object' || schema.properties) return this.generateInterface(name, schema);
    return `export type ${name} = any;`;
  }

  private generateInterface(name: string, schema: OpenApiSchema): string {
    const required = schema.required || [];
    const properties = Object.entries(schema.properties || {})
      .map(([propName, propSchema]) =>
        `  ${propName}${required.includes(propName) ? '' : '?'}: ${this.resolveType(propSchema)};`)
      .join('\n');
    return `export interface ${name} {\n${properties}\n}`;
  }

  private resolveType(schema: OpenApiSchema, seen = new Set<string>()): string {
    if (schema.$ref) return this.resolveRef(schema.$ref, seen);
    if (schema.enum) return this.resolveEnum(schema.enum);

    const mapper = this.config.typeMappers.get(schema.type || 'unknown');
    return mapper ? mapper(schema, (s: any) => this.resolveType(s, seen)) : 'any';
  }

  private resolveRef(ref: string, seen: Set<string>): string {
    const refName = this.extractRefName(ref);
    if (seen.has(refName)) return refName;
    seen.add(refName);

    const schema = this.schemas[refName];
    return schema ? this.resolveType(schema, seen) : refName;
  }

  private resolveEnum(enumValues: any[]): string {
    return enumValues.map(v => JSON.stringify(v)).join(' | ');
  }

  private extractRefName(ref: string): string {
    return ref.split('/').pop()!;
  }

  private isEmptyObject(schema: OpenApiSchema): boolean {
    return (schema.type === 'object' || !!schema.properties || !!schema.additionalProperties) &&
      (!schema.properties || Object.keys(schema.properties).length === 0) &&
      (!schema.additionalProperties || schema.additionalProperties === true);
  }

  private writeTypeFile(name: string, content: string): void {
    fs.writeFileSync(path.join(this.config.outputDir, `${name}${this.config.fileExtension}`), content + '\n');
  }
}

new OpenApiGeneratorBuilder()
  .fromSpec('bron-open-api-public.json')
  .toDirectory('src/types')
  .build()
  .generate();
