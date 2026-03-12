const fs = require("fs");
const path = require("path");

const GIF_EXTENSION = ".gif";

function pickRandom(items) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function getCategoryDirectories(rootDirectory) {
  if (!fs.existsSync(rootDirectory)) {
    return [];
  }

  const entries = fs.readdirSync(rootDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(rootDirectory, entry.name));
}

function getGifFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === GIF_EXTENSION)
    .map((entry) => path.join(directory, entry.name));
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function getRandomMeme(options = {}) {
  const memeRoot = options.memeRoot || "memes";
  const rootDirectory = path.resolve(process.cwd(), memeRoot);

  if (!fs.existsSync(rootDirectory)) {
    return null;
  }

  const categories = getCategoryDirectories(rootDirectory);

  if (!categories.length) {
    return pickRandom(getGifFiles(rootDirectory));
  }

  const categoryOrder = shuffle(categories);
  for (const categoryDirectory of categoryOrder) {
    const gifFiles = getGifFiles(categoryDirectory);
    if (gifFiles.length) {
      return pickRandom(gifFiles);
    }
  }

  return null;
}

module.exports = {
  getRandomMeme
};
