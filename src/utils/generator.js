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
new OpenApiGeneratorBuilder()
    .fromSpec('bron-open-api-public.json')
    .toDirectory('src/types')
    .build()
    .generate();
