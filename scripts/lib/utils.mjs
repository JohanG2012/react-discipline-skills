import fs from "fs/promises";
import path from "path";

export async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readFile(filePath) {
  return fs.readFile(filePath, "utf8");
}

export async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, "utf8");
}

export async function listDirs(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
}

export async function listFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.filter((e) => e.isFile()).map((e) => e.name).sort();
}

export function parseFrontmatter(content) {
  if (!content.startsWith("---")) return null;
  const lines = content.split("\n");
  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) return null;
  const data = {};
  let section = null;
  let listKey = null;
  for (let i = 1; i < endIndex; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (!line.startsWith(" ")) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      section = null;
      listKey = null;
      if (!value) {
        data[key] = {};
        section = key;
      } else {
        data[key] = value;
      }
      continue;
    }

    if (!section) continue;

    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      if (listKey && Array.isArray(data[section][listKey])) {
        data[section][listKey].push(trimmed.slice(2).trim());
      }
      continue;
    }

    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!value) {
      data[section][key] = [];
      listKey = key;
    } else {
      data[section][key] = value;
      listKey = null;
    }
  }

  return data;
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function resolvePath(...parts) {
  return path.resolve(...parts);
}
