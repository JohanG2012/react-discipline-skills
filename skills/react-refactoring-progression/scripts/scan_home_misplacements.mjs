#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

const DEFAULT_LIMIT = 10;
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const DEFAULT_HOME_PREFIX_TO_CANONICAL = new Map([
  ["features", "features"],
  ["ui", "ui"],
  ["pages", "pages"],
  ["views", "pages"],
  ["api", "api"],
  ["core", "core"],
  ["hooks", "hooks"],
  ["lib", "lib"],
  ["store", "store"],
  ["state", "store"],
  ["config", "config"],
]);
const DEFAULT_EXPECTED_SOURCE_HOME_DIRS = [
  "ui",
  "features",
  "pages",
  "views",
  "api",
  "core",
  "hooks",
  "lib",
  "store",
  "state",
  "config",
];
const EXCLUDE_DIRS = new Set([
  ".git",
  ".next",
  ".specify",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);
const UI_FORBIDDEN_IMPORTED_HOMES = new Set([
  "features",
  "api",
  "store",
  "state",
  "pages",
  "views",
]);

function toPosixPath(input) {
  return input.replaceAll(path.sep, "/");
}

function toNoSrc(relPath) {
  if (relPath.startsWith("src/")) return relPath.slice(4);
  const nestedSrc = relPath.indexOf("/src/");
  if (nestedSrc >= 0) return relPath.slice(nestedSrc + 5);
  return relPath;
}

function isTestFile(relPath) {
  return /(^|\/)__tests__\//.test(relPath) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(relPath);
}

function parseArgs(argv) {
  const args = {
    repo: process.cwd(),
    limit: DEFAULT_LIMIT,
    frontendRoots: [],
    homeDirs: [],
    pathsOnly: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--repo") {
      args.repo = argv[i + 1] ?? args.repo;
      i += 1;
      continue;
    }
    if (arg === "--limit") {
      const parsed = Number.parseInt(argv[i + 1] ?? "", 10);
      if (Number.isInteger(parsed) && parsed > 0) {
        args.limit = parsed;
      }
      i += 1;
      continue;
    }
    if (arg === "--frontend-root") {
      const next = argv[i + 1];
      if (next) {
        args.frontendRoots.push(next);
        i += 1;
      }
      continue;
    }
    if (arg === "--home-dir") {
      const next = argv[i + 1];
      if (next) {
        args.homeDirs.push(next);
        i += 1;
      }
      continue;
    }
    if (arg === "--paths-only") {
      args.pathsOnly = true;
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      process.stdout.write(
        [
          "Usage: scan_home_misplacements.mjs [options]",
          "",
          "Options:",
          "  --repo <path>      Repository root to scan (default: cwd)",
          "  --limit <n>        Max candidates to return (default: 10)",
          "  --frontend-root    Frontend source root to scan (repeatable, required)",
          "  --home-dir         Home dir mapping (repeatable, required): <dir> or <dir>=<canonical>",
          "  --paths-only       Print only file paths, one per line",
          "  -h, --help         Show this help",
          "",
          "Output:",
          "  JSON with review file paths only (no placement recommendations).",
          "",
          "Example:",
          "  --frontend-root apps/web/src",
        ].join("\n"),
      );
      process.exit(0);
    }
  }

  return args;
}

function normalizeHomeDirName(value) {
  return value
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/^src\//, "");
}

function parseHomeDirOverride(rawValue) {
  const value = normalizeHomeDirName(rawValue);
  if (!value) return null;

  const separators = ["=", ":"];
  for (const separator of separators) {
    const splitAt = value.indexOf(separator);
    if (splitAt > 0) {
      const prefix = normalizeHomeDirName(value.slice(0, splitAt));
      const canonical = normalizeHomeDirName(value.slice(splitAt + 1));
      if (!prefix || !canonical) return null;
      return { prefix, canonical };
    }
  }

  const defaultCanonical = DEFAULT_HOME_PREFIX_TO_CANONICAL.get(value) ?? value;
  return { prefix: value, canonical: defaultCanonical };
}

function buildHomeConfig(homeDirOverrides) {
  if (homeDirOverrides.length === 0) {
    throw new Error("Missing required --home-dir <dir>|<dir>=<canonical> (repeatable).");
  }

  const homePrefixToCanonical = new Map(DEFAULT_HOME_PREFIX_TO_CANONICAL);
  const expectedSourceHomeDirs = new Set(DEFAULT_EXPECTED_SOURCE_HOME_DIRS);

  for (const rawOverride of homeDirOverrides) {
    const parsed = parseHomeDirOverride(rawOverride);
    if (!parsed) {
      throw new Error(`Invalid --home-dir value '${rawOverride}'. Expected <dir> or <dir>=<canonical>.`);
    }
    homePrefixToCanonical.set(parsed.prefix, parsed.canonical);
    expectedSourceHomeDirs.add(parsed.prefix);
  }

  return {
    homePrefixToCanonical,
    expectedSourceHomeDirs: [...expectedSourceHomeDirs],
  };
}

async function hasExpectedSourceHomes(absPath, expectedSourceHomeDirs) {
  for (const dirName of expectedSourceHomeDirs) {
    const candidate = path.join(absPath, dirName);
    const stats = await fs.stat(candidate).catch(() => null);
    if (stats && stats.isDirectory()) {
      return true;
    }
  }
  return false;
}

function normalizeRepoRel(repoRoot, absPath) {
  const rel = toPosixPath(path.relative(repoRoot, absPath));
  return rel === "." ? "" : rel;
}

async function buildScanRoots(repoRoot, explicitRoots, expectedSourceHomeDirs) {
  if (explicitRoots.length === 0) {
    throw new Error("Missing required --frontend-root <frontend-source-root> (repeatable).");
  }

  const dedupedRoots = new Map();
  for (const value of explicitRoots) {
    const absPath = path.resolve(repoRoot, value);
    const stats = await fs.stat(absPath).catch(() => null);
    if (!stats || !stats.isDirectory()) {
      throw new Error(`Frontend root is not a directory: ${value}`);
    }

    const looksLikeSourceRoot = await hasExpectedSourceHomes(
      absPath,
      expectedSourceHomeDirs,
    );
    if (!looksLikeSourceRoot) {
      const suggestedSrc = path.join(absPath, "src");
      const srcLooksValid = await hasExpectedSourceHomes(
        suggestedSrc,
        expectedSourceHomeDirs,
      );
      if (srcLooksValid) {
        const suggestion = toPosixPath(path.relative(repoRoot, suggestedSrc) || "src");
        throw new Error(
          `Expected --frontend-root to be a frontend source root. Received '${value}'. Try '${suggestion}'.`,
        );
      }
      throw new Error(
        `Expected --frontend-root to be a frontend source root (contains homes like ui/, features/, pages/): ${value}`,
      );
    }

    const rootRel = normalizeRepoRel(repoRoot, absPath);
    if (!dedupedRoots.has(rootRel)) {
      dedupedRoots.set(rootRel, { rootAbs: absPath, rootRel });
    }
  }

  const scanRoots = [];

  for (const frontendRoot of dedupedRoots.values()) {
    const scanBaseAbs = frontendRoot.rootAbs;
    const scanBaseRel = normalizeRepoRel(repoRoot, scanBaseAbs);
    const srcRootRel = scanBaseRel;
    scanRoots.push({
      ...frontendRoot,
      scanBaseAbs,
      scanBaseRel,
      srcRootRel,
    });
  }

  return scanRoots;
}

async function walkCodeFiles(repoRoot, scanRoots) {
  const files = [];
  const seen = new Set();

  async function visit(currentAbs, context) {
    const entries = await fs.readdir(currentAbs, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(currentAbs, entry.name);
      const rel = toPosixPath(path.relative(repoRoot, abs));
      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
        await visit(abs, context);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name);
      if (!CODE_EXTENSIONS.has(ext)) continue;
      if (isTestFile(rel)) continue;
      if (seen.has(rel)) continue;
      seen.add(rel);
      files.push({ relPath: rel, context });
    }
  }

  for (const context of scanRoots) {
    await visit(context.scanBaseAbs, context);
  }

  return files;
}

function extractImports(source) {
  const imports = [];
  const patterns = [
    /import\s+(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/g,
    /export\s+[^'"]+?\s+from\s+['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    let match = pattern.exec(source);
    while (match) {
      imports.push(match[1]);
      match = pattern.exec(source);
    }
  }
  return imports;
}

function featureOwner(relNoSrc) {
  const match = relNoSrc.match(/(?:^|\/)features\/([^/]+)\//);
  return match ? match[1] : null;
}

function inferHome(relNoSrc, homePrefixToCanonical) {
  const prefixes = [...homePrefixToCanonical.keys()].sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (relNoSrc === prefix || relNoSrc.startsWith(`${prefix}/`)) {
      return homePrefixToCanonical.get(prefix);
    }
  }
  return "other";
}

function resolveImportToRepoRel(fileRel, importSpec, repoRoot, context) {
  if (!importSpec || importSpec.startsWith("#")) return null;
  if (importSpec.startsWith("@/") || importSpec.startsWith("~/")) {
    const aliasBase = context.srcRootRel ?? context.rootRel;
    const relTarget = toPosixPath(path.join(aliasBase, importSpec.slice(2)));
    return relTarget.startsWith("./") ? relTarget.slice(2) : relTarget;
  }
  if (importSpec.startsWith("src/")) {
    const base = context.rootRel;
    const relTarget = base ? toPosixPath(path.join(base, importSpec)) : importSpec;
    return relTarget.startsWith("./") ? relTarget.slice(2) : relTarget;
  }

  if (!importSpec.startsWith(".")) return null;

  const fileDir = path.dirname(fileRel);
  const resolved = toPosixPath(path.normalize(path.join(fileDir, importSpec)));
  if (resolved.startsWith("../")) return null;

  const abs = path.resolve(repoRoot, resolved);
  const rel = toPosixPath(path.relative(repoRoot, abs));
  if (rel.startsWith("../")) return null;
  return rel;
}

function hasReactImport(importSpecs) {
  return importSpecs.some((spec) => spec === "react" || spec.startsWith("react/"));
}

function hasNetworkCalls(source) {
  return /\bfetch\s*\(|\baxios\s*\(|\baxios\.[A-Za-z]+\s*\(/.test(source);
}

function hasJsxLikeMarkup(source) {
  return /<([A-Z][A-Za-z0-9]*)\b/.test(source);
}

function addSignal(signals, { id, score }) {
  signals.push({ id, score });
}

function scanFile(relPath, source, importSpecs, resolvedImports, homePrefixToCanonical) {
  const relNoSrc = toNoSrc(relPath);
  const home = inferHome(relNoSrc, homePrefixToCanonical);
  const inUi = home === "ui";
  const inFeatures = home === "features";
  const inPages = home === "pages";
  const inApi = home === "api";
  const inHooks = home === "hooks" || /(?:^|\/)features\/[^/]+\/hooks\//.test(relNoSrc);
  const inLib = home === "lib";

  const signals = [];

  const importedHomes = resolvedImports
    .map((item) => inferHome(toNoSrc(item), homePrefixToCanonical));
  const importedFeatureOwners = resolvedImports
    .map((item) => featureOwner(toNoSrc(item)))
    .filter(Boolean);
  const ownFeatureOwner = featureOwner(relNoSrc);

  if (inFeatures && ownFeatureOwner) {
    for (const owner of importedFeatureOwners) {
      if (owner !== ownFeatureOwner) {
        addSignal(signals, {
          id: "cross_feature_import",
          score: 9,
        });
      }
    }
  }

  if (inUi && importedHomes.some((h) => UI_FORBIDDEN_IMPORTED_HOMES.has(h))) {
    addSignal(signals, {
      id: "ui_forbidden_import_layer",
      score: 8,
    });
  }

  if (inApi) {
    if (hasReactImport(importSpecs)) {
      addSignal(signals, {
        id: "api_imports_react",
        score: 8,
      });
    }
    if (importedHomes.some((h) => ["ui", "pages"].includes(h))) {
      addSignal(signals, {
        id: "api_imports_presentation_layer",
        score: 8,
      });
    }
  }

  if (hasNetworkCalls(source) && !relNoSrc.startsWith("api/endpoints/")) {
    addSignal(signals, {
      id: "network_outside_endpoint_home",
      score: 7,
    });
  }

  if (inHooks && hasJsxLikeMarkup(source)) {
    addSignal(signals, {
      id: "jsx_inside_hook_layer",
      score: 7,
    });
  }

  if (inPages && resolvedImports.some((item) => toNoSrc(item).startsWith("api/endpoints/"))) {
    addSignal(signals, {
      id: "page_imports_endpoint_directly",
      score: 6,
    });
  }

  if (inLib && hasReactImport(importSpecs)) {
    addSignal(signals, {
      id: "lib_imports_react",
      score: 6,
    });
  }

  if (inUi && /(window\.history|window\.location|window\.dispatchEvent|new\s+CustomEvent\s*\(|localStorage\.|sessionStorage\.)/.test(source)) {
    addSignal(signals, {
      id: "ui_browser_side_effects",
      score: 6,
    });
  }

  if (!inPages && /(export\s+(default\s+)?function\s+\w*Page\b|const\s+\w*Page\s*=)/.test(source)) {
    addSignal(signals, {
      id: "page_like_component_outside_pages",
      score: 4,
    });
  }

  if (signals.length === 0) return null;

  const score = signals.reduce((sum, signal) => sum + signal.score, 0);
  return {
    file_path: relPath,
    score,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(args.repo);
  const homeConfig = buildHomeConfig(args.homeDirs);
  const scanRoots = await buildScanRoots(
    repoRoot,
    args.frontendRoots,
    homeConfig.expectedSourceHomeDirs,
  );
  const files = await walkCodeFiles(repoRoot, scanRoots);

  const candidates = [];
  for (const file of files) {
    const { relPath, context } = file;
    const absPath = path.join(repoRoot, relPath);
    const source = await fs.readFile(absPath, "utf8");
    const imports = extractImports(source);
    const resolvedImports = imports
      .map((spec) => resolveImportToRepoRel(relPath, spec, repoRoot, context))
      .filter(Boolean);
    const candidate = scanFile(
      relPath,
      source,
      imports,
      resolvedImports,
      homeConfig.homePrefixToCanonical,
    );
    if (candidate) candidates.push(candidate);
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.file_path.localeCompare(b.file_path);
  });

  const topCandidates = candidates.slice(0, args.limit);
  const filePaths = topCandidates.map((item) => item.file_path);

  if (args.pathsOnly) {
    process.stdout.write(filePaths.join("\n"));
    if (filePaths.length > 0) process.stdout.write("\n");
    return;
  }

  const output = {
    result_type: "home_misplacement_candidates",
    file_paths: filePaths,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
