const axios = require("axios");

function pickRandom(items) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

async function fetchRandomTenorGif(options = {}) {
  const apiKey = options.apiKey;
  if (!apiKey) {
    return null;
  }

  const query = options.query || "meme";
  const clientKey = options.clientKey || "brah_bot";
  const limit = Number(options.limit || 20);

  try {
    const response = await axios.get("https://tenor.googleapis.com/v2/search", {
      params: {
        key: apiKey,
        client_key: clientKey,
        q: query,
        media_filter: "gif",
        random: true,
        limit: Math.min(Math.max(limit, 1), 50)
      },
      timeout: 5000
    });

    const result = pickRandom(response.data?.results || []);
    return result?.media_formats?.gif?.url || null;
  } catch (error) {
    console.warn("Tenor fallback failed:", error.message);
    return null;
  }
}

module.exports = {
  fetchRandomTenorGif
};
