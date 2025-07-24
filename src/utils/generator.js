"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiSdkGenerator = void 0;
var fs = require("fs");
var path = require("path");
var OpenApiSdkGenerator = /** @class */ (function () {
    function OpenApiSdkGenerator(specPath, typesDir, apiDir) {
        var _this = this;
        this.specPath = specPath;
        this.typesDir = typesDir;
        this.apiDir = apiDir;
        this.typeMappers = new Map([
            ['string', function () { return 'string'; }],
            ['integer', function () { return 'number'; }],
            ['number', function () { return 'number'; }],
            ['boolean', function () { return 'boolean'; }],
            ['array', function (schema) { return "".concat(_this.resolveType(schema.items), "[]"); }],
            ['object', function (schema) { return _this.buildObjectType(schema); }]
        ]);
        this.spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
    }
    OpenApiSdkGenerator.prototype.generate = function () {
        this.generateTypes();
        this.generateApi();
    };
    OpenApiSdkGenerator.prototype.generateTypes = function () {
        var _this = this;
        this.prepareDirectory(this.typesDir, '.ts');
        Object.entries(this.spec.components.schemas).forEach(function (_a) {
            var name = _a[0], schema = _a[1];
            return fs.writeFileSync(path.join(_this.typesDir, "".concat(name, ".ts")), _this.generateTypeDefinition(name, schema) + '\n');
        });
    };
    OpenApiSdkGenerator.prototype.generateApi = function () {
        var _this = this;
        this.prepareDirectory(this.apiDir, '.ts');
        var fileData = {};
        Object.entries(this.spec.paths).forEach(function (_a) {
            var route = _a[0], methods = _a[1];
            return Object.entries(methods).forEach(function (_a) {
                var method = _a[0], op = _a[1];
                if (!op.summary)
                    return;
                var fileName = _this.getFileName(op);
                if (!fileData[fileName])
                    fileData[fileName] = { types: new Set(), interfaces: {}, methods: [] };
                var _b = _this.processParameters(op), paramType = _b.paramType, paramOptional = _b.paramOptional, localInterface = _b.localInterface;
                var returnType = _this.getReturnType(op);
                if (localInterface)
                    fileData[fileName].interfaces[paramType] = localInterface;
                if (returnType)
                    fileData[fileName].types.add(returnType);
                if (_this.isRefType(paramType))
                    fileData[fileName].types.add(paramType);
                fileData[fileName].methods.push(_this.generateMethod(_this.toCamelCase(op.summary), method, route, paramType, paramOptional, returnType));
            });
        });
        Object.entries(fileData).forEach(function (_a) {
            var fileName = _a[0], data = _a[1];
            return fs.writeFileSync(path.join(_this.apiDir, "".concat(fileName, ".ts")), _this.generateApiFile(fileName, data));
        });
    };
    OpenApiSdkGenerator.prototype.generateTypeDefinition = function (name, schema) {
        var _a;
        if (schema.enum)
            return "export type ".concat(name, " = ").concat(schema.enum.map(function (v) { return JSON.stringify(v); }).join(' | '), ";");
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
    OpenApiSdkGenerator.prototype.generateInterface = function (name, schema) {
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
    OpenApiSdkGenerator.prototype.processParameters = function (op) {
        var _this = this;
        var _a, _b, _c, _d;
        if ((_c = (_b = (_a = op.requestBody) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b['application/json']) === null || _c === void 0 ? void 0 : _c.schema) {
            var schema = op.requestBody.content['application/json'].schema;
            if (schema.$ref) {
                return { paramType: this.extractRefName(schema.$ref), paramOptional: '' };
            }
            if (schema.type === 'object' && schema.properties) {
                var interfaceName = this.getInterfaceName(op, 'Request');
                return {
                    paramType: interfaceName,
                    paramOptional: this.areAllFieldsOptional(schema) ? '?' : '',
                    localInterface: this.generateLocalInterface(interfaceName, schema)
                };
            }
        }
        if ((_d = op.parameters) === null || _d === void 0 ? void 0 : _d.length) {
            var interfaceName = this.getInterfaceName(op, 'Params');
            var fields = op.parameters
                .filter(function (p) { return p.in === 'query' || p.in === 'path'; })
                .map(function (p) { return "  ".concat(p.name).concat(p.required ? '' : '?', ": ").concat(_this.getParameterType(p.schema), ";"); })
                .join('\n');
            if (fields) {
                var localInterface = "export interface ".concat(interfaceName, " {\n").concat(fields, "\n}\n");
                return {
                    paramType: interfaceName,
                    paramOptional: this.areInterfaceFieldsOptional(localInterface) ? '?' : '',
                    localInterface: localInterface
                };
            }
        }
        return { paramType: 'any', paramOptional: '?' };
    };
    OpenApiSdkGenerator.prototype.generateMethod = function (funcName, method, route, paramType, paramOptional, returnType) {
        var pathExpr = route.replace(/{(\w+)}/g, function (_, p1) {
            return p1 === 'workspaceId' ? '${this.workspaceId}' : "${params.".concat(p1, "}");
        });
        var args = ["method: \"".concat(method.toUpperCase(), "\""), "path: `".concat(pathExpr, "`")];
        if (paramType !== 'any') {
            args.push(['get', 'delete'].includes(method) ? 'query: params' : 'body: params');
        }
        var methodBody = "return this.http.request".concat(returnType ? "<".concat(returnType, ">") : '', "({\n    ").concat(args.join(',\n    '), "\n  });");
        var signature = paramType === 'any'
            ? "async ".concat(funcName, "()").concat(returnType ? ": Promise<".concat(returnType, ">") : '')
            : "async ".concat(funcName, "(params").concat(paramOptional, ": ").concat(paramType, ")").concat(returnType ? ": Promise<".concat(returnType, ">") : '');
        return "  ".concat(signature, " {\n    ").concat(methodBody, "\n  }");
    };
    OpenApiSdkGenerator.prototype.generateApiFile = function (fileName, data) {
        var imports = __spreadArray(__spreadArray([], Array.from(data.types).map(function (type) { return "import { ".concat(type, " } from \"../types/").concat(type, ".js\";"); }), true), [
            'import { HttpClient } from "../utils/http.js";'
        ], false).join('\n');
        var localInterfaces = Object.values(data.interfaces).join('\n');
        var className = "".concat(fileName.charAt(0).toUpperCase() + fileName.slice(1), "API");
        return [
            imports,
            '',
            localInterfaces,
            "export class ".concat(className, " {"),
            '  constructor(private http: HttpClient, private workspaceId: string) {}',
            '',
            data.methods.join('\n\n'),
            '}'
        ].filter(Boolean).join('\n');
    };
    OpenApiSdkGenerator.prototype.resolveType = function (schema, seen) {
        if (seen === void 0) { seen = new Set(); }
        if (schema.$ref) {
            var refName = this.extractRefName(schema.$ref);
            if (seen.has(refName))
                return refName;
            seen.add(refName);
            return this.spec.components.schemas[refName] ? this.resolveType(this.spec.components.schemas[refName], seen) : refName;
        }
        if (schema.enum)
            return schema.enum.map(function (v) { return JSON.stringify(v); }).join(' | ');
        var mapper = this.typeMappers.get(schema.type || 'unknown');
        return mapper ? mapper(schema) : 'any';
    };
    OpenApiSdkGenerator.prototype.buildObjectType = function (schema) {
        var _this = this;
        if (!schema.properties) {
            var valueType = schema.additionalProperties === true ? 'any'
                : schema.additionalProperties ? this.resolveType(schema.additionalProperties) : 'any';
            return "Record<string, ".concat(valueType, ">");
        }
        var required = schema.required || [];
        return '{ ' + Object.entries(schema.properties)
            .map(function (_a) {
            var key = _a[0], prop = _a[1];
            return "".concat(key).concat(required.includes(key) ? '' : '?', ": ").concat(_this.resolveType(prop));
        })
            .join('; ') + ' }';
    };
    OpenApiSdkGenerator.prototype.prepareDirectory = function (dir, extension) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        else {
            fs.readdirSync(dir, { withFileTypes: true })
                .filter(function (dirent) { return dirent.isFile() && dirent.name.endsWith(extension); })
                .forEach(function (dirent) { return fs.unlinkSync(path.join(dir, dirent.name)); });
        }
    };
    OpenApiSdkGenerator.prototype.getFileName = function (op) {
        var _a;
        return ((_a = op.tags) === null || _a === void 0 ? void 0 : _a.length) ? this.toCamelCase(op.tags[0]) : 'misc';
    };
    OpenApiSdkGenerator.prototype.getReturnType = function (op) {
        var _a, _b, _c, _d;
        var schema = (_d = (_c = (_b = (_a = op.responses) === null || _a === void 0 ? void 0 : _a['200']) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c['application/json']) === null || _d === void 0 ? void 0 : _d.schema;
        return (schema === null || schema === void 0 ? void 0 : schema.$ref) ? this.extractRefName(schema.$ref) : undefined;
    };
    OpenApiSdkGenerator.prototype.getInterfaceName = function (op, suffix) {
        return op.operationId
            ? "".concat(this.toPascalCase(op.operationId)).concat(suffix)
            : "".concat(this.toPascalCase(op.summary.replace(/^(Get|Create|Update|Delete|Retrieve|Post|Put|Patch|Remove|Deactivate)\s+/i, ''))).concat(suffix);
    };
    OpenApiSdkGenerator.prototype.generateLocalInterface = function (name, schema) {
        var _this = this;
        var required = schema.required || [];
        var fields = Object.entries(schema.properties || {})
            .map(function (_a) {
            var prop = _a[0], propSchema = _a[1];
            return "  ".concat(prop).concat(required.includes(prop) ? '' : '?', ": ").concat(_this.getParameterType(propSchema), ";");
        })
            .join('\n');
        return "export interface ".concat(name, " {\n").concat(fields, "\n}\n");
    };
    OpenApiSdkGenerator.prototype.getParameterType = function (schema) {
        if (!schema)
            return 'any';
        if (schema.type === 'array')
            return 'string[]';
        if (schema.type === 'string')
            return 'string';
        if (schema.type === 'integer' || schema.type === 'number')
            return 'number';
        if (schema.type === 'boolean')
            return 'boolean';
        return 'any';
    };
    OpenApiSdkGenerator.prototype.areAllFieldsOptional = function (schema) {
        var _a;
        return !((_a = schema.required) === null || _a === void 0 ? void 0 : _a.length) || Object.keys(schema.properties || {}).every(function (key) { return !schema.required.includes(key); });
    };
    OpenApiSdkGenerator.prototype.areInterfaceFieldsOptional = function (interfaceDef) {
        var fields = interfaceDef.split('\n')
            .map(function (l) { return l.trim(); })
            .filter(function (l) { return l && !l.startsWith('export interface') && l !== '}'; });
        return fields.length === 0 || fields.every(function (l) { return l.includes('?:'); });
    };
    OpenApiSdkGenerator.prototype.isRefType = function (paramType) {
        return paramType !== 'any' && !paramType.endsWith('Params') && !paramType.endsWith('Request');
    };
    OpenApiSdkGenerator.prototype.isEmptyObject = function (schema) {
        return (schema.type === 'object' || !!schema.properties || !!schema.additionalProperties) &&
            (!schema.properties || Object.keys(schema.properties).length === 0) &&
            (!schema.additionalProperties || schema.additionalProperties === true);
    };
    OpenApiSdkGenerator.prototype.extractRefName = function (ref) {
        return ref.split('/').pop();
    };
    OpenApiSdkGenerator.prototype.toCamelCase = function (str) {
        return str.replace(/[-_ ]+(.)/g, function (_, c) { return c ? c.toUpperCase() : ''; })
            .replace(/^(.)/, function (c) { return c.toLowerCase(); });
    };
    OpenApiSdkGenerator.prototype.toPascalCase = function (str) {
        return str.replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, function (_, __, c) { return c ? c.toUpperCase() : ''; })
            .replace(/[^a-zA-Z0-9]/g, '');
    };
    return OpenApiSdkGenerator;
}());
exports.OpenApiSdkGenerator = OpenApiSdkGenerator;
new OpenApiSdkGenerator('bron-open-api-public.json', 'src/types', 'src/api').generate();
