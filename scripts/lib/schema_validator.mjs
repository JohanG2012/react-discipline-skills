// Keep this list in sync with validateSchema(). If new keywords are introduced
// in schemas, validation support must be added before checks pass.
export const supportedSchemaKeywords = new Set([
  "$schema",
  "$id",
  "$defs",
  "$ref",
  "title",
  "description",
  "type",
  "required",
  "properties",
  "additionalProperties",
  "allOf",
  "anyOf",
  "oneOf",
  "not",
  "if",
  "then",
  "else",
  "items",
  "enum",
  "const",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
]);

const schemaChildObjectMapKeys = new Set(["properties", "$defs"]);
const schemaChildArrayKeys = new Set(["allOf", "anyOf", "oneOf"]);
const schemaChildSingleKeys = new Set(["items", "not", "if", "then", "else", "additionalProperties"]);

function isType(value, type) {
  if (type === "array") return Array.isArray(value);
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "null") return value === null;
  return typeof value === type;
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function resolveRef(rootSchema, ref) {
  if (typeof ref !== "string" || !ref.startsWith("#/")) return null;

  const parts = ref
    .slice(2)
    .split("/")
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));

  let current = rootSchema;
  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return null;
    }
    current = current[part];
  }

  return current;
}

export function collectUnsupportedSchemaKeywords(schema, location = "$") {
  const errors = [];
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return errors;
  }

  for (const [key, value] of Object.entries(schema)) {
    if (!supportedSchemaKeywords.has(key)) {
      errors.push(`${location} uses unsupported schema keyword "${key}"`);
    }

    if (schemaChildObjectMapKeys.has(key)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        for (const [childName, childSchema] of Object.entries(value)) {
          errors.push(
            ...collectUnsupportedSchemaKeywords(childSchema, `${location}.${key}.${childName}`),
          );
        }
      }
      continue;
    }

    if (schemaChildArrayKeys.has(key)) {
      if (Array.isArray(value)) {
        value.forEach((childSchema, index) => {
          errors.push(
            ...collectUnsupportedSchemaKeywords(childSchema, `${location}.${key}[${index}]`),
          );
        });
      }
      continue;
    }

    if (schemaChildSingleKeys.has(key)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        errors.push(...collectUnsupportedSchemaKeywords(value, `${location}.${key}`));
      }
    }
  }

  return errors;
}

export function validateSchema(schema, data, location = "$", rootSchema = schema) {
  const errors = [];

  if (!schema || typeof schema !== "object") {
    return errors;
  }

  if (schema.$ref) {
    const resolved = resolveRef(rootSchema, schema.$ref);
    if (!resolved) {
      errors.push(`${location} has unresolved ref ${schema.$ref}`);
      return errors;
    }
    return validateSchema(resolved, data, location, rootSchema);
  }

  if (Array.isArray(schema.allOf)) {
    for (const subSchema of schema.allOf) {
      errors.push(...validateSchema(subSchema, data, location, rootSchema));
    }
  }

  if (Array.isArray(schema.anyOf)) {
    const branchErrors = schema.anyOf.map((subSchema) => validateSchema(subSchema, data, location, rootSchema));
    const anyMatch = branchErrors.some((errs) => errs.length === 0);
    if (!anyMatch) {
      errors.push(`${location} should match at least one anyOf branch`);
    }
  }

  if (Array.isArray(schema.oneOf)) {
    const branchErrors = schema.oneOf.map((subSchema) => validateSchema(subSchema, data, location, rootSchema));
    const matches = branchErrors.filter((errs) => errs.length === 0).length;
    if (matches !== 1) {
      errors.push(`${location} should match exactly one oneOf branch`);
    }
  }

  if (schema.not && typeof schema.not === "object") {
    const notErrors = validateSchema(schema.not, data, location, rootSchema);
    if (notErrors.length === 0) {
      errors.push(`${location} must not match disallowed schema`);
    }
  }

  if (schema.if && typeof schema.if === "object") {
    const ifErrors = validateSchema(schema.if, data, location, rootSchema);
    const matchesIf = ifErrors.length === 0;

    if (matchesIf && schema.then) {
      errors.push(...validateSchema(schema.then, data, location, rootSchema));
    }

    if (!matchesIf && schema.else) {
      errors.push(...validateSchema(schema.else, data, location, rootSchema));
    }
  }

  if (schema.type && !isType(data, schema.type)) {
    errors.push(`${location} should be ${schema.type}`);
    return errors;
  }

  if (Array.isArray(schema.enum) && !schema.enum.some((candidate) => deepEqual(candidate, data))) {
    errors.push(`${location} should be one of ${JSON.stringify(schema.enum)}`);
  }

  if (Object.prototype.hasOwnProperty.call(schema, "const") && !deepEqual(schema.const, data)) {
    errors.push(`${location} should equal ${JSON.stringify(schema.const)}`);
  }

  if (typeof data === "number") {
    if (typeof schema.minimum === "number" && data < schema.minimum) {
      errors.push(`${location} should be >= ${schema.minimum}`);
    }
    if (typeof schema.maximum === "number" && data > schema.maximum) {
      errors.push(`${location} should be <= ${schema.maximum}`);
    }
    if (typeof schema.exclusiveMinimum === "number" && data <= schema.exclusiveMinimum) {
      errors.push(`${location} should be > ${schema.exclusiveMinimum}`);
    }
    if (typeof schema.exclusiveMaximum === "number" && data >= schema.exclusiveMaximum) {
      errors.push(`${location} should be < ${schema.exclusiveMaximum}`);
    }
  }

  if (typeof data === "string") {
    if (typeof schema.minLength === "number" && data.length < schema.minLength) {
      errors.push(`${location} should have length >= ${schema.minLength}`);
    }
    if (typeof schema.maxLength === "number" && data.length > schema.maxLength) {
      errors.push(`${location} should have length <= ${schema.maxLength}`);
    }
  }

  if (Array.isArray(data)) {
    if (typeof schema.minItems === "number" && data.length < schema.minItems) {
      errors.push(`${location} should have at least ${schema.minItems} items`);
    }
    if (typeof schema.maxItems === "number" && data.length > schema.maxItems) {
      errors.push(`${location} should have at most ${schema.maxItems} items`);
    }
    if (schema.uniqueItems === true) {
      for (let i = 0; i < data.length; i += 1) {
        for (let j = i + 1; j < data.length; j += 1) {
          if (deepEqual(data[i], data[j])) {
            errors.push(`${location} should have unique items`);
            i = data.length;
            break;
          }
        }
      }
    }

    if (schema.items) {
      data.forEach((item, index) => {
        errors.push(...validateSchema(schema.items, item, `${location}[${index}]`, rootSchema));
      });
    }
  }

  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    const propertyCount = Object.keys(data).length;
    if (typeof schema.minProperties === "number" && propertyCount < schema.minProperties) {
      errors.push(`${location} should have at least ${schema.minProperties} properties`);
    }
    if (typeof schema.maxProperties === "number" && propertyCount > schema.maxProperties) {
      errors.push(`${location} should have at most ${schema.maxProperties} properties`);
    }

    const required = schema.required || [];
    for (const key of required) {
      if (!(key in data)) {
        errors.push(`${location}.${key} is required`);
      }
    }

    const properties = schema.properties || {};
    for (const key of Object.keys(properties)) {
      if (key in data) {
        errors.push(...validateSchema(properties[key], data[key], `${location}.${key}`, rootSchema));
      }
    }

    if (schema.additionalProperties === false) {
      for (const key of Object.keys(data)) {
        if (!(key in properties)) {
          errors.push(`${location}.${key} is not allowed`);
        }
      }
    }
  }

  return errors;
}
