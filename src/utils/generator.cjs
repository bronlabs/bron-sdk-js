"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var OpenApiGeneratorBuilder = /** @class */ (function () {
    function OpenApiGeneratorBuilder() {
        var _this = this;
        this.config = {
            specPath: '',
            outputDir: '',
            typeMappers: new Map([
                ['string', function () { return 'string'; }],
                ['integer', function () { return 'number'; }],
                ['number', function () { return 'number'; }],
                ['boolean', function () { return 'boolean'; }],
                ['array', function (schema, resolve) { return "".concat(resolve(schema.items), "[]"); }],
                ['object', function (schema, resolve) { return _this.buildObjectType(schema, resolve); }]
            ]),
            fileExtension: '.ts',
            cleanOutput: true
        };
    }
    OpenApiGeneratorBuilder.prototype.fromSpec = function (path) {
        this.config.specPath = path;
        return this;
    };
    OpenApiGeneratorBuilder.prototype.toDirectory = function (dir) {
        this.config.outputDir = dir;
        return this;
    };
    OpenApiGeneratorBuilder.prototype.build = function () {
        if (!this.config.specPath || !this.config.outputDir) {
            throw new Error('Spec path and output directory are required');
        }
        return new OpenApiGenerator(this.config);
    };
    OpenApiGeneratorBuilder.prototype.buildObjectType = function (schema, resolve) {
        if (!schema.properties) {
            var valueType = schema.additionalProperties === true ? 'any'
                : schema.additionalProperties ? resolve(schema.additionalProperties) : 'any';
            return "Record<string, ".concat(valueType, ">");
        }
        var required = schema.required || [];
        return '{ ' + Object.entries(schema.properties)
            .map(function (_a) {
            var key = _a[0], prop = _a[1];
            return "".concat(key).concat(required.includes(key) ? '' : '?', ": ").concat(resolve(prop));
        })
            .join('; ') + ' }';
    };
    return OpenApiGeneratorBuilder;
}());
var OpenApiGenerator = /** @class */ (function () {
    function OpenApiGenerator(config) {
        this.config = config;
        this.schemas = this.loadSchemas();
    }
    OpenApiGenerator.prototype.generate = function () {
        var _this = this;
        this.prepareOutput();
        Object.entries(this.schemas).forEach(function (_a) {
            var name = _a[0], schema = _a[1];
            return _this.writeTypeFile(name, _this.generateType(name, schema));
        });
    };
    OpenApiGenerator.prototype.loadSchemas = function () {
        var spec = JSON.parse(fs.readFileSync(this.config.specPath, 'utf-8'));
        return spec.components.schemas;
    };
    OpenApiGenerator.prototype.prepareOutput = function () {
        var _this = this;
        if (!this.config.cleanOutput)
            return;
        if (fs.existsSync(this.config.outputDir)) {
            fs.readdirSync(this.config.outputDir, { withFileTypes: true })
                .filter(function (dirent) { return dirent.isFile() && dirent.name.endsWith(_this.config.fileExtension); })
                .forEach(function (dirent) { return fs.unlinkSync(path.join(_this.config.outputDir, dirent.name)); });
        }
        else {
            fs.mkdirSync(this.config.outputDir);
        }
    };
    OpenApiGenerator.prototype.generateType = function (name, schema) {
        var _a;
        if (schema.enum)
            return "export type ".concat(name, " = ").concat(this.resolveEnum(schema.enum), ";");
        if (((_a = schema.allOf) === null || _a === void 0 ? void 0 : _a.length) === 1 && schema.allOf[0].$ref)
            return "export type ".concat(name, " = ").concat(this.extractRefName(schema.allOf[0].$ref), ";");
        if (schema.$ref)
            return "export type ".concat(name, " = ").concat(this.extractRefName(schema.$ref), ";");
        if (this.isEmptyObject(schema))
            return "export type ".concat(name, " = Record<string, any>;");
        if (schema.type === 'object' || schema.properties)
            return this.generateInterface(name, schema);
        return "export type ".concat(name, " = any;");
    };
    OpenApiGenerator.prototype.generateInterface = function (name, schema) {
        var _this = this;
        var required = schema.required || [];
        var properties = Object.entries(schema.properties || {})
            .map(function (_a) {
            var propName = _a[0], propSchema = _a[1];
            return "  ".concat(propName).concat(required.includes(propName) ? '' : '?', ": ").concat(_this.resolveType(propSchema), ";");
        })
            .join('\n');
        return "export interface ".concat(name, " {\n").concat(properties, "\n}");
    };
    OpenApiGenerator.prototype.resolveType = function (schema, seen) {
        var _this = this;
        if (seen === void 0) { seen = new Set(); }
        if (schema.$ref)
            return this.resolveRef(schema.$ref, seen);
        if (schema.enum)
            return this.resolveEnum(schema.enum);
        var mapper = this.config.typeMappers.get(schema.type || 'unknown');
        return mapper ? mapper(schema, function (s) { return _this.resolveType(s, seen); }) : 'any';
    };
    OpenApiGenerator.prototype.resolveRef = function (ref, seen) {
        var refName = this.extractRefName(ref);
        if (seen.has(refName))
            return refName;
        seen.add(refName);
        var schema = this.schemas[refName];
        return schema ? this.resolveType(schema, seen) : refName;
    };
    OpenApiGenerator.prototype.resolveEnum = function (enumValues) {
        return enumValues.map(function (v) { return JSON.stringify(v); }).join(' | ');
    };
    OpenApiGenerator.prototype.extractRefName = function (ref) {
        return ref.split('/').pop();
    };
    OpenApiGenerator.prototype.isEmptyObject = function (schema) {
        return (schema.type === 'object' || !!schema.properties || !!schema.additionalProperties) &&
            (!schema.properties || Object.keys(schema.properties).length === 0) &&
            (!schema.additionalProperties || schema.additionalProperties === true);
    };
    OpenApiGenerator.prototype.writeTypeFile = function (name, content) {
        fs.writeFileSync(path.join(this.config.outputDir, "".concat(name).concat(this.config.fileExtension)), content + '\n');
    };
    return OpenApiGenerator;
}());

// --- API DIRECTORY PREP ---
const apiDir = path.join(__dirname, '../api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
} else {
  fs.readdirSync(apiDir, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.ts'))
    .forEach(dirent => fs.unlinkSync(path.join(apiDir, dirent.name)));
}

// --- API FUNCTION GENERATION ---
function toCamelCase(str) {
  return str.replace(/[-_ ]+(.)/g, (_, c) => c ? c.toUpperCase() : '')
            .replace(/^(.)/, (c) => c.toLowerCase());
}

function toPascalCase(str) {
  return str
    .replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, (_, __, c) => c ? c.toUpperCase() : '')
    .replace(/[^a-zA-Z0-9]/g, '');
}

function chooseFile(op) {
  // Use the first tag if available
  if (op.tags && op.tags.length > 0) {
    return toCamelCase(op.tags[0]);
  }
  return 'misc';
}

function getImports(file) {
  const imports = [];
  if (file === 'balances' || file === 'accounts' || file === 'transactions' || file === 'transactionLimits' || file === 'addresses' || file === 'assets' || file === 'addressBook' || file === 'workspace') {
    imports.push('import { HttpClient } from "../utils/http.js";');
  }
  return imports;
}

function extractRefsFromOperation(op) {
  const refs = new Set();
  // Responses
  if (op.responses) {
    for (const resp of Object.values(op.responses)) {
      if (resp.content && resp.content['application/json'] && resp.content['application/json'].schema) {
        collectRefs(resp.content['application/json'].schema, refs);
      }
    }
  }
  // Request body
  if (op.requestBody && op.requestBody.content && op.requestBody.content['application/json'] && op.requestBody.content['application/json'].schema) {
    collectRefs(op.requestBody.content['application/json'].schema, refs);
  }
  // Parameters
  if (op.parameters) {
    for (const param of op.parameters) {
      if (param.schema) {
        collectRefs(param.schema, refs);
      }
    }
  }
  return refs;
}

function collectRefs(schema, refs) {
  if (schema.$ref) {
    const match = schema.$ref.match(/#\/components\/schemas\/(\w+)/);
    if (match) refs.add(match[1]);
  }
  if (schema.items) collectRefs(schema.items, refs);
  if (schema.oneOf) schema.oneOf.forEach(s => collectRefs(s, refs));
  if (schema.allOf) schema.allOf.forEach(s => collectRefs(s, refs));
  if (schema.anyOf) schema.anyOf.forEach(s => collectRefs(s, refs));
  if (schema.properties) {
    for (const prop of Object.values(schema.properties)) {
      collectRefs(prop, refs);
    }
  }
}

function cleanSummary(summary) {
  // Remove leading verbs like 'Get', 'Create', 'Update', 'Delete', etc.
  return summary.replace(/^(Get|Create|Update|Delete|Retrieve|Post|Put|Patch|Remove|Deactivate)\s+/i, '');
}

const fileModelImports = {};

const openApi = JSON.parse(fs.readFileSync('bron-open-api-public.json', 'utf-8'));
for (const [route, methods] of Object.entries(openApi.paths)) {
  for (const [method, op] of Object.entries(methods)) {
    if (!op.summary) continue;
    const file = chooseFile(op);
    if (!fileModelImports[file]) fileModelImports[file] = new Set();
    const refs = extractRefsFromOperation(op);
    refs.forEach(ref => fileModelImports[file].add(ref));
  }
}

// --- GENERATE LOCAL PARAM/REQUEST INTERFACES IN API FILES ---
const fileLocalInterfaces = {}; // file -> { ifaceName: ifaceDef }
const fileFunctionTypes = {}; // file -> Set of used types (for imports)
const fileFunctionStubs = {}; // file -> array of function stubs

function buildMethodLogic(op, method, path, paramType, returnType) {
  // Replace {param} in path with template string using this.workspaceId or params.<param>
  let pathExpr = path.replace(/{(\w+)}/g, (match, p1) => {
    if (p1 === 'workspaceId') return '${this.workspaceId}';
    return `  `;
  });

  let args = [
    `method: "${method.toUpperCase()}"`,
    `path: \`${pathExpr}\``
  ];

  // Determine if we need query or body
  if (["get", "delete"].includes(method.toLowerCase())) {
    if (paramType !== "any") args.push("query: params");
  } else if (["post", "put", "patch"].includes(method.toLowerCase())) {
    if (paramType !== "any") args.push("body: params");
  }

  return [
    `return this.http.request${returnType ? `<${returnType}>` : ''}({`,
    '  ' + args.join(',\n  '),
    '});'
  ].join('\n');
}

function isParamsOptional(interfaceDef) {
  // Returns true if all fields in the interface are optional or if the interface is empty, ignoring workspaceId
  // Ignores comments, interface declaration, and closing brace
  const lines = interfaceDef.split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('export interface') && l !== '}' && !l.startsWith('//'));
  // Remove workspaceId field from consideration
  const filtered = lines.filter(l => !/^workspaceId\??:/.test(l));
  if (filtered.length === 0) return true; // Empty (or only workspaceId)
  // If any field does NOT contain '?', params should not be optional
  return filtered.every(l => l.includes('?:'));
}

for (const [route, methods] of Object.entries(openApi.paths)) {
  for (const [method, op] of Object.entries(methods)) {
    if (!op.summary) continue;
    const funcName = toCamelCase(op.summary);
    const file = chooseFile(op);
    if (!fileLocalInterfaces[file]) fileLocalInterfaces[file] = {};
    if (!fileFunctionTypes[file]) fileFunctionTypes[file] = new Set();
    if (!fileFunctionStubs[file]) fileFunctionStubs[file] = [];

    // Local param interface for query/path parameters
    let paramType = 'any';
    let paramOptional = '?'; // Default to optional if no params
    let localIfaceString = null;
    let isRefType = false;
    if (op.parameters && op.parameters.length > 0) {
      const ifaceName = op.operationId
        ? `${toPascalCase(op.operationId)}Params`
        : `${toPascalCase(cleanSummary(op.summary))}Params`;
      if (!fileLocalInterfaces[file][ifaceName]) {
        let fields = '';
        for (const param of op.parameters) {
          if (param.in === 'query' || param.in === 'path') {
            let type = 'any';
            if (param.schema) {
              if (param.schema.type === 'array') type = 'string[]';
              else if (param.schema.type === 'string') type = 'string';
              else if (param.schema.type === 'integer' || param.schema.type === 'number') type = 'number';
              else if (param.schema.type === 'boolean') type = 'boolean';
            }
            fields += `  ${param.name}${param.required ? '' : '?'}: ${type};\n`;
          }
        }
        if (fields) {
          fileLocalInterfaces[file][ifaceName] = `export interface ${ifaceName} {\n${fields}}\n`;
        }
      }
      if (fileLocalInterfaces[file][ifaceName]) {
        paramType = ifaceName;
        localIfaceString = fileLocalInterfaces[file][ifaceName];
        paramOptional = isParamsOptional(localIfaceString) ? '?' : '';
      }
    }
    // Request body: if $ref, use imported type; if inline, generate local interface
    if (op.requestBody && op.requestBody.content && op.requestBody.content['application/json']) {
      const schema = op.requestBody.content['application/json'].schema;
      if (schema && schema.$ref) {
        const match = schema.$ref.match(/#\/components\/schemas\/(\w+)/);
        if (match) {
          paramType = match[1];
          paramOptional = ''; // Default to required for $ref
          isRefType = true;
          fileFunctionTypes[file].add(paramType);
        }
      } else if (schema && schema.type === 'object' && schema.properties) {
        const ifaceName = op.operationId
          ? `${toPascalCase(op.operationId)}Request`
          : `${toPascalCase(cleanSummary(op.summary))}Request`;
        if (!fileLocalInterfaces[file][ifaceName]) {
          let fields = '';
          for (const [prop, propSchema] of Object.entries(schema.properties)) {
            let type = 'any';
            if (propSchema.type === 'array') type = 'string[]';
            else if (propSchema.type === 'string') type = 'string';
            else if (propSchema.type === 'integer' || propSchema.type === 'number') type = 'number';
            else if (propSchema.type === 'boolean') type = 'boolean';
            fields += `  ${prop}${schema.required && schema.required.includes(prop) ? '' : '?'}: ${type};\n`;
          }
          fileLocalInterfaces[file][ifaceName] = `export interface ${ifaceName} {\n${fields}}\n`;
        }
        paramType = ifaceName;
        localIfaceString = fileLocalInterfaces[file][ifaceName];
        paramOptional = isParamsOptional(localIfaceString) ? '?' : '';
      }
    }
    // If no requestBody, check for a single parameter referencing a schema
    if (paramType === 'any' && op.parameters && op.parameters.length === 1) {
      const param = op.parameters[0];
      if (param.schema && param.schema.$ref) {
        const match = param.schema.$ref.match(/#\/components\/schemas\/(\w+)/);
        if (match) {
          paramType = match[1];
          paramOptional = ''; // Default to required for $ref
          isRefType = true;
          fileFunctionTypes[file].add(paramType);
        }
      }
    }

    // Return type (try to infer from responses)
    let returnType = null;
    if (op.responses && op.responses['200'] && op.responses['200'].content && op.responses['200'].content['application/json'] && op.responses['200'].content['application/json'].schema) {
      const schema = op.responses['200'].content['application/json'].schema;
      if (schema.$ref) {
        const match = schema.$ref.match(/#\/components\/schemas\/(\w+)/);
        if (match) {
          returnType = match[1];
          fileFunctionTypes[file].add(returnType);
        }
      }
    }

    // Function stub
    const returnTypeStr = returnType ? `: Promise<${returnType}>` : '';
    let funcStub;
    if (paramType === 'any') {
      // No params argument at all
      funcStub = [
        `async ${funcName}()${returnTypeStr} {`,
        buildMethodLogic(op, method, route, paramType, returnType).split('\n').map(l => '  ' + l).join('\n'),
        '}'
      ].join('\n');
    } else {
      funcStub = [
        `async ${funcName}(params${paramOptional}: ${paramType})${returnTypeStr} {`,
        buildMethodLogic(op, method, route, paramType, returnType).split('\n').map(l => '  ' + l).join('\n'),
        '}'
      ].join('\n');
    }
    fileFunctionStubs[file].push(funcStub);
  }
}

// --- GENERATE CLASS-BASED API FILES ---
for (const file of Object.keys(fileFunctionStubs)) {
  const filePath = path.join(apiDir, `${file}.ts`);
  const usedTypes = Array.from(fileFunctionTypes[file]);
  // Always import HttpClient
  const importLines = [
    ...usedTypes.map(type => `import { ${type} } from "../types/${type}.js";`),
    'import { HttpClient } from "../utils/http.js";'
  ].join('\n');
  // Remove workspaceId from local interfaces
  const localInterfaces = Object.values(fileLocalInterfaces[file] || {})
    .map(def => def.replace(/\n\s*workspaceId\??:.*?;/g, ''))
    .join('\n');
  // Class name: PascalCase + 'API'
  const className = `${file.charAt(0).toUpperCase() + file.slice(1)}API`;
  // Constructor
  const constructor = `  constructor(private http: HttpClient, private workspaceId: string) {}`;
  // Methods: indent each method by 2 spaces and remove 'export' from method signature (even with leading whitespace)
  const classMethods = fileFunctionStubs[file]
    .map(fn => fn.replace(/^\s*export\s+async\s+function\s+/, '  async '))
    .join('\n');
  // Class definition with a blank line between constructor and first method
  const classDef = `export class ${className} {\n${constructor}\n\n${classMethods}\n}`;

  // Place imports before local interfaces and class export, with exactly one blank line after imports and interfaces
  let fileContent = importLines + '\n\n';
  if (localInterfaces.trim()) {
    fileContent += localInterfaces + '\n';
  }
  fileContent += classDef;
  fs.writeFileSync(filePath, fileContent);
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

new OpenApiGeneratorBuilder()
    .fromSpec('bron-open-api-public.json')
    .toDirectory('src/types')
    .build()
    .generate();
