const fs = require("fs");
const path = require("path");

const SUPPORTED_EXTENSIONS = new Set([".gif", ".png", ".jpg", ".jpeg", ".webp"]);

function isSupportedMemeFile(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXTENSIONS.has(extension);
}

function collectMemeFiles(rootDirectory) {
  if (!fs.existsSync(rootDirectory)) {
    return [];
  }

  const files = [];
  const entries = fs.readdirSync(rootDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectMemeFiles(fullPath));
      continue;
    }

    if (entry.isFile() && isSupportedMemeFile(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function pickRandom(items) {
  if (!items.length) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

async function getRandomMeme(options = {}) {
  const memeRoot = options.memeRoot || "memes";
  const category = options.category;
  const baseRoot = path.resolve(process.cwd(), memeRoot);
  const searchRoot = category ? path.join(baseRoot, category) : baseRoot;
  const memeFiles = collectMemeFiles(searchRoot);

  return pickRandom(memeFiles);
}

module.exports = {
  getRandomMeme
};
