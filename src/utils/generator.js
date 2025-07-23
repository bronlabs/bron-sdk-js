const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const openApiPath = path.join(__dirname, 'bron-open-api-public.json');

// 1. Delete all files in models directory
if (fs.existsSync(modelsDir)) {
  fs.readdirSync(modelsDir).forEach(file => {
    const filePath = path.join(modelsDir, file);
    if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });
} else {
  fs.mkdirSync(modelsDir);
}

// 2. Parse OpenAPI JSON
const openApiRaw = fs.readFileSync(openApiPath, 'utf-8');
const openApiSpec = JSON.parse(openApiRaw);
const schemas = openApiSpec.components.schemas;

// 3. Type mapping and helpers
function resolveRefTypeInline(ref, schemas, seen = new Set()) {
  const refName = ref.split('/').pop();
  if (seen.has(refName)) return refName; // Prevent infinite recursion
  seen.add(refName);
  const schema = schemas[refName];
  if (!schema) return refName;
  if (schema.enum) {
    return schema.enum.map(v => JSON.stringify(v)).join(' | ');
  }
  if (schema.$ref) {
    return resolveRefTypeInline(schema.$ref, schemas, seen);
  }
  if (schema.type === 'object' || schema.properties) {
    const required = schema.required || [];
    return (
      '{ ' +
      Object.entries(schema.properties || {})
        .map(([key, prop]) => {
          const optional = required.includes(key) ? '' : '?';
          return `${key}${optional}: ${toTsType(prop, schemas, seen)}`;
        })
        .join('; ') +
      ' }'
    );
  }
  return refName;
}

function toTsType(property, schemas, seen = new Set()) {
  if (property.$ref) {
    return resolveRefTypeInline(property.$ref, schemas, seen);
  }
  if (property.enum) {
    return property.enum.map(v => JSON.stringify(v)).join(' | ');
  }
  switch (property.type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return toTsType(property.items, schemas, seen) + '[]';
    case 'object':
      if (property.properties) {
        const required = property.required || [];
        return (
          '{ ' +
          Object.entries(property.properties)
            .map(([key, prop]) => {
              const optional = required.includes(key) ? '' : '?';
              return `${key}${optional}: ${toTsType(prop, schemas, seen)}`;
            })
            .join('; ') +
          ' }'
        );
      }
      if (property.additionalProperties) {
        const valueType = property.additionalProperties === true
          ? 'any'
          : toTsType(property.additionalProperties, schemas, seen);
        return `Record<string, ${valueType}>`;
      }
      return '{ [key: string]: any }';
    default:
      return 'any';
  }
}

// 4. Generate and write models
for (const [modelName, schema] of Object.entries(schemas)) {
  let output = '';
  if (schema.enum) {
    // Type alias for enums
    output = `export type ${modelName} = ${schema.enum.map(v => JSON.stringify(v)).join(' | ')};\n`;
  } else if (schema.allOf && schema.allOf.length === 1 && schema.allOf[0].$ref) {
    // Type alias for references
    const refName = schema.allOf[0].$ref.split('/').pop();
    output = `export type ${modelName} = ${refName};\n`;
  } else if (
    (schema.type === 'object' || schema.properties || schema.additionalProperties) &&
    (!schema.properties || Object.keys(schema.properties).length === 0) &&
    (!schema.additionalProperties || schema.additionalProperties === true)
  ) {
    // Object with no properties (free-form object)
    output = `export type ${modelName} = Record<string, any>;\n`;
  } else if (schema.type === 'object' || schema.properties) {
    const required = schema.required || [];
    output = `export interface ${modelName} {\n`;
    for (const [propName, propSchema] of Object.entries(schema.properties || {})) {
      const optional = required.includes(propName) ? '' : '?';
      output += `  ${propName}${optional}: ${toTsType(propSchema, schemas)};\n`;
    }
    output += '}\n';
  } else if (schema.$ref) {
    // Type alias for direct references
    const refName = schema.$ref.split('/').pop();
    output = `export type ${modelName} = ${refName};\n`;
  } else {
    // Fallback for other types
    output = `export type ${modelName} = any;\n`;
  }
  const filePath = path.join(modelsDir, `${modelName}.ts`);
  fs.writeFileSync(filePath, output);
}