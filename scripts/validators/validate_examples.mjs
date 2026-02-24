import path from "path";
import {
  listDirs,
  listFiles,
  pathExists,
  readFile,
} from "../lib/utils.mjs";
import {
  collectUnsupportedSchemaKeywords,
  validateSchema,
} from "../lib/schema_validator.mjs";

const repoRoot = process.cwd();
const skillsRoot = path.join(repoRoot, "skills");

async function validateSkill(skillDir) {
  const skillPath = path.join(skillsRoot, skillDir);
  const schemaPath = path.join(skillPath, "schemas", "output.schema.json");
  const schemaExists = await pathExists(schemaPath);
  if (!schemaExists) return [];

  const schema = JSON.parse(await readFile(schemaPath));
  const schemaKeywordErrors = collectUnsupportedSchemaKeywords(schema, "$");
  const errors = schemaKeywordErrors.map((err) => `${schemaPath}: ${err}`);

  const examplesPath = path.join(skillPath, "examples");
  const exampleFiles = (await listFiles(examplesPath)).filter((f) => f.endsWith(".json"));
  const examplePayloads = [];
  for (const file of exampleFiles) {
    const filePath = path.join(examplesPath, file);
    const data = JSON.parse(await readFile(filePath));
    examplePayloads.push({ filePath, data });
    const validationErrors = validateSchema(schema, data, "$", schema);
    if (validationErrors.length) {
      for (const err of validationErrors) {
        errors.push(`${filePath}: ${err}`);
      }
    }
  }

  const resultTypeEnum = schema?.properties?.result_type?.enum;
  if (Array.isArray(resultTypeEnum) && resultTypeEnum.length) {
    const resultTypesInExamples = new Set(
      examplePayloads
        .map(({ data }) => data.result_type)
        .filter((value) => typeof value === "string"),
    );

    for (const resultType of resultTypeEnum) {
      if (!resultTypesInExamples.has(resultType)) {
        errors.push(
          `${skillPath}: missing example for result_type "${resultType}"`,
        );
      }
    }
  }

  return errors;
}

async function listSkillTargets() {
  return (await listDirs(skillsRoot))
    .filter((d) => !d.startsWith("."))
    .sort();
}

async function run() {
  const skillDirs = await listSkillTargets();
  const errors = [];
  for (const skillDir of skillDirs) {
    const skillErrors = await validateSkill(skillDir);
    errors.push(...skillErrors);
  }

  if (errors.length) {
    for (const err of errors) {
      process.stderr.write(`${err}\n`);
    }
    process.exit(1);
  }
}

run().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
