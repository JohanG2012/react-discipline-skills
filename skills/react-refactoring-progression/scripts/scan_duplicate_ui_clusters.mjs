#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

const DEFAULT_LIMIT = 10;
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
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
const EXPECTED_SOURCE_HOME_DIRS = ["ui", "features", "pages", "api", "core", "hooks", "lib", "store", "config"];
const GENERIC_DOM_TAGS = new Set(["div", "span", "section", "article", "main", "aside", "header", "footer", "p"]);
const INTERACTIVE_OR_STRUCTURAL_TAGS = new Set([
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "form",
  "label",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "nav",
  "dialog",
  "details",
  "summary",
]);
const ATOMIC_CONTROL_TAGS = new Set([
  "button",
  "input",
  "select",
  "textarea",
  "a",
]);
const ATOMIC_CONTROL_EXCLUDED_PROPS = new Set([
  "children",
  "className",
  "key",
  "ref",
  "style",
  "id",
]);
const COMPONENT_PROP_EXCLUDED_KEYS = new Set([
  "children",
  "className",
  "key",
  "ref",
  "style",
  "id",
]);

function toPosixPath(input) {
  return input.replaceAll(path.sep, "/");
}

function normalizeRepoRel(repoRoot, absPath) {
  const rel = toPosixPath(path.relative(repoRoot, absPath));
  return rel === "." ? "" : rel;
}

function parseArgs(argv) {
  const args = {
    repo: process.cwd(),
    limit: DEFAULT_LIMIT,
    frontendRoots: [],
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
    if (arg === "--paths-only") {
      args.pathsOnly = true;
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      process.stdout.write(
        [
          "Usage: scan_duplicate_ui_clusters.mjs [options]",
          "",
          "Options:",
          "  --repo <path>      Repository root to scan (default: cwd)",
          "  --limit <n>        Max review groups to return (default: 10)",
          "  --frontend-root    Frontend source root to scan (repeatable, required)",
          "  --paths-only       Print only suggested file paths, one per line",
          "  -h, --help         Show this help",
          "",
          "Output:",
          "  JSON with candidate cross-file review groups only.",
          "  review_groups[].pattern_hint is a heuristic:",
          "  structural_cluster|component_composition|atomic_control.",
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

function isTestLike(relPath) {
  return (
    /(^|\/)__tests__\//.test(relPath)
    || /\.(test|spec|stories)\.[cm]?[jt]sx?$/.test(relPath)
  );
}

async function hasExpectedSourceHomes(absPath) {
  for (const dirName of EXPECTED_SOURCE_HOME_DIRS) {
    const candidate = path.join(absPath, dirName);
    const stats = await fs.stat(candidate).catch(() => null);
    if (stats && stats.isDirectory()) {
      return true;
    }
  }
  return false;
}

async function buildScanRoots(repoRoot, explicitRoots) {
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

    const looksLikeSourceRoot = await hasExpectedSourceHomes(absPath);
    if (!looksLikeSourceRoot) {
      const suggestedSrc = path.join(absPath, "src");
      const srcLooksValid = await hasExpectedSourceHomes(suggestedSrc);
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

    const rel = normalizeRepoRel(repoRoot, absPath);
    if (!dedupedRoots.has(rel)) {
      dedupedRoots.set(rel, { rootAbs: absPath, rootRel: rel });
    }
  }

  return [...dedupedRoots.values()];
}

async function walkCodeFiles(repoRoot, scanRoots) {
  const files = [];
  const seen = new Set();

  async function visit(currentAbs) {
    const entries = await fs.readdir(currentAbs, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(currentAbs, entry.name);
      const rel = toPosixPath(path.relative(repoRoot, abs));

      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
        await visit(abs);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!CODE_EXTENSIONS.has(path.extname(entry.name))) continue;
      if (isTestLike(rel)) continue;
      if (seen.has(rel)) continue;

      seen.add(rel);
      files.push(rel);
    }
  }

  for (const root of scanRoots) {
    await visit(root.rootAbs);
  }

  return files;
}

function buildLineStarts(source) {
  const starts = [0];
  for (let i = 0; i < source.length; i += 1) {
    if (source[i] === "\n") {
      starts.push(i + 1);
    }
  }
  return starts;
}

function lineFromOffset(offset, lineStarts) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (lineStarts[mid] <= offset) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return hi + 1;
}

function extractClassTokens(tagSource) {
  const tokens = new Set();
  const patterns = [
    /className\s*=\s*"([^"]+)"/g,
    /className\s*=\s*'([^']+)'/g,
    /className\s*=\s*\{\s*"([^"]+)"\s*\}/g,
    /className\s*=\s*\{\s*'([^']+)'\s*\}/g,
    /className\s*=\s*\{\s*`([^`]+)`\s*\}/g,
  ];

  for (const pattern of patterns) {
    let match = pattern.exec(tagSource);
    while (match) {
      const value = match[1].replaceAll(/\$\{[^}]*\}/g, " ");
      for (const token of value.split(/\s+/)) {
        const trimmed = token.trim();
        if (!trimmed) continue;
        if (/^[A-Za-z0-9:_\-/.]+$/.test(trimmed)) {
          tokens.add(trimmed);
        }
      }
      match = pattern.exec(tagSource);
    }
  }

  return [...tokens];
}

function extractPropKeys(tagSource, tagName) {
  const keys = new Set();
  const prefix = `<${tagName}`;
  const attributes = (
    tagSource.startsWith(prefix) ? tagSource.slice(prefix.length) : tagSource
  ).replace(/\/?>$/, "");
  const assignedPropPattern = /\s([A-Za-z_:][A-Za-z0-9:._-]*)\s*=(?!=)/g;

  let match = assignedPropPattern.exec(attributes);
  while (match) {
    const key = match[1];
    keys.add(key);
    match = assignedPropPattern.exec(attributes);
  }

  return [...keys];
}

function extractTags(source) {
  const tags = [];
  const lineStarts = buildLineStarts(source);
  const tagRegex = /<([A-Za-z][A-Za-z0-9._-]*)\b[^>]*>/g;

  let match = tagRegex.exec(source);
  while (match) {
    const tagSource = match[0];
    if (tagSource.startsWith("</") || tagSource.startsWith("<!") || tagSource.startsWith("<?")) {
      match = tagRegex.exec(source);
      continue;
    }

    const name = match[1];
    const line = lineFromOffset(match.index, lineStarts);
    const isDom = /^[a-z]/.test(name);
    const classTokens = extractClassTokens(tagSource);
    const propKeys = extractPropKeys(tagSource, name);

    tags.push({
      name,
      line,
      isDom,
      classTokens,
      propKeys,
    });

    match = tagRegex.exec(source);
  }

  return tags;
}

function buildWindowSignature(windowTags) {
  const normalized = windowTags.map((tag) => {
    if (tag.isDom) {
      return tag.name.toLowerCase();
    }

    const propSignature = [...new Set(tag.propKeys)]
      .filter((prop) => !COMPONENT_PROP_EXCLUDED_KEYS.has(prop))
      .sort()
      .slice(0, 6)
      .join(",");

    return propSignature
      ? `C:${tag.name}(${propSignature})`
      : `C:${tag.name}`;
  });
  return normalized.join(">");
}

function windowSpecificity(windowTags) {
  let score = 0;
  let nonGenericDom = 0;
  let interactiveDom = 0;
  let componentCount = 0;
  const classTokens = new Set();

  for (const tag of windowTags) {
    if (!tag.isDom) {
      componentCount += 1;
      score += 1.5;
      continue;
    }

    const lower = tag.name.toLowerCase();
    if (!GENERIC_DOM_TAGS.has(lower)) {
      nonGenericDom += 1;
      score += 1.25;
    }
    if (INTERACTIVE_OR_STRUCTURAL_TAGS.has(lower)) {
      interactiveDom += 1;
      score += 1.25;
    }

    for (const token of tag.classTokens) {
      classTokens.add(token);
    }
  }

  score += Math.min(classTokens.size, 8) * 0.15;
  return {
    score,
    nonGenericDom,
    interactiveDom,
    componentCount,
    classTokenCount: classTokens.size,
  };
}

function collectWindowOccurrences(relPath, tags) {
  const occurrences = [];
  if (tags.length < 2) return occurrences;

  const minSize = 2;
  const maxSize = Math.min(8, tags.length);

  for (let size = minSize; size <= maxSize; size += 1) {
    for (let start = 0; start <= tags.length - size; start += 1) {
      const windowTags = tags.slice(start, start + size);
      const startLine = windowTags[0].line;
      const endLine = windowTags[windowTags.length - 1].line;
      if (endLine - startLine > 90) continue;

      const domCount = windowTags.filter((tag) => tag.isDom).length;
      const componentCount = windowTags.length - domCount;
      if (size < 4 && componentCount < 2) continue;
      if (domCount < 2 && componentCount < 2) continue;

      const signature = buildWindowSignature(windowTags);
      const specificity = windowSpecificity(windowTags);

      if (specificity.nonGenericDom === 0 && specificity.interactiveDom === 0 && specificity.componentCount === 0) {
        continue;
      }

      const genericOnly = windowTags.every((tag) => tag.isDom && GENERIC_DOM_TAGS.has(tag.name.toLowerCase()));
      if (genericOnly && specificity.classTokenCount < 3) {
        continue;
      }

      occurrences.push({
        signature,
        relPath,
        startLine,
        endLine,
        size,
        specificityScore: specificity.score,
        patternHint: componentCount >= 2
          ? "component_composition"
          : "structural_cluster",
      });
    }
  }

  return occurrences;
}

function collectAtomicControlOccurrences(relPath, tags) {
  const occurrences = [];

  for (const tag of tags) {
    if (!tag.isDom) continue;

    const lowerName = tag.name.toLowerCase();
    if (!ATOMIC_CONTROL_TAGS.has(lowerName)) continue;

    const classTokens = [...new Set(tag.classTokens)].sort();
    const propKeys = [...new Set(tag.propKeys)]
      .filter((prop) => !ATOMIC_CONTROL_EXCLUDED_PROPS.has(prop))
      .sort();

    const hasStableClass = classTokens.length >= 2;
    const hasStableProps = propKeys.length >= 1;
    if (!hasStableClass || !hasStableProps) continue;

    const signature = `atomic:${lowerName}|class:${classTokens.join(".")}|props:${propKeys.join(",")}`;
    const specificityScore = 2
      + Math.min(classTokens.length, 10) * 0.6
      + Math.min(propKeys.length, 8) * 0.4
      + ((lowerName === "button" || lowerName === "input") ? 1 : 0);

    occurrences.push({
      signature,
      relPath,
      startLine: tag.line,
      endLine: tag.line,
      size: 1,
      specificityScore,
      patternHint: "atomic_control",
    });
  }

  return occurrences;
}

function selectBestPerFile(occurrences) {
  const byFile = new Map();
  for (const occurrence of occurrences) {
    const current = byFile.get(occurrence.relPath);
    if (!current) {
      byFile.set(occurrence.relPath, occurrence);
      continue;
    }
    if (occurrence.specificityScore > current.specificityScore) {
      byFile.set(occurrence.relPath, occurrence);
      continue;
    }
    if (occurrence.specificityScore === current.specificityScore && occurrence.startLine < current.startLine) {
      byFile.set(occurrence.relPath, occurrence);
    }
  }
  return [...byFile.values()];
}

function toLocation(filePath, startLine, endLine) {
  return startLine === endLine ? `${filePath}:${startLine}` : `${filePath}:${startLine}-${endLine}`;
}

function buildGroups(signatureMap, limit) {
  const groups = [];

  for (const [signature, rawOccurrences] of signatureMap.entries()) {
    const perFile = selectBestPerFile(rawOccurrences);
    if (perFile.length < 2) continue;
    if (perFile.length > 20) continue;

    const avgSpecificity = perFile.reduce((sum, item) => sum + item.specificityScore, 0) / perFile.length;
    const avgWindowSize = perFile.reduce((sum, item) => sum + item.size, 0) / perFile.length;
    const patternHint = perFile[0].patternHint ?? "structural_cluster";
    const atomicBonus = patternHint === "atomic_control" ? 2 : 0;
    const componentBonus = patternHint === "component_composition" ? 1.5 : 0;

    const score = (perFile.length * 4)
      + (avgWindowSize * 1.5)
      + avgSpecificity
      + atomicBonus
      + componentBonus;

    const filePaths = perFile.map((item) => item.relPath).sort();
    const sampleLocations = perFile
      .sort((a, b) => a.relPath.localeCompare(b.relPath))
      .slice(0, 6)
      .map((item) => toLocation(item.relPath, item.startLine, item.endLine));

    groups.push({
      signature,
      pattern_hint: patternHint,
      score,
      file_paths: filePaths,
      sample_locations: sampleLocations,
    });
  }

  groups.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.file_paths.length !== a.file_paths.length) return b.file_paths.length - a.file_paths.length;
    return a.file_paths[0].localeCompare(b.file_paths[0]);
  });

  const seenPathSets = new Set();
  const limited = [];
  for (const group of groups) {
    const pathSetKey = `${group.pattern_hint}|${group.file_paths.join("|")}`;
    if (seenPathSets.has(pathSetKey)) continue;
    seenPathSets.add(pathSetKey);

    limited.push({
      group_id: `g${limited.length + 1}`,
      pattern_hint: group.pattern_hint,
      file_paths: group.file_paths,
      sample_locations: group.sample_locations,
    });

    if (limited.length >= limit) break;
  }

  return limited;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(args.repo);
  const scanRoots = await buildScanRoots(repoRoot, args.frontendRoots);
  const files = await walkCodeFiles(repoRoot, scanRoots);

  const signatureMap = new Map();

  for (const relPath of files) {
    const absPath = path.join(repoRoot, relPath);
    const source = await fs.readFile(absPath, "utf8");
    if (!source.includes("<")) continue;

    const tags = extractTags(source);
    if (!tags.length) continue;

    const occurrences = [
      ...collectWindowOccurrences(relPath, tags),
      ...collectAtomicControlOccurrences(relPath, tags),
    ];
    for (const occurrence of occurrences) {
      if (!signatureMap.has(occurrence.signature)) {
        signatureMap.set(occurrence.signature, []);
      }
      signatureMap.get(occurrence.signature).push(occurrence);
    }
  }

  const reviewGroups = buildGroups(signatureMap, args.limit);
  const uniquePaths = [...new Set(reviewGroups.flatMap((group) => group.file_paths))].sort();

  if (args.pathsOnly) {
    process.stdout.write(uniquePaths.join("\n"));
    if (uniquePaths.length > 0) process.stdout.write("\n");
    return;
  }

  const output = {
    result_type: "ui_dom_duplicate_cluster_candidates",
    review_groups: reviewGroups,
    file_paths: uniquePaths,
  };

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
