const axios = require("axios");

function pickRandom(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

async function searchGif(query) {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    console.warn("Missing GIPHY_API_KEY. Cannot fetch GIFs from Giphy.");
    return null;
  }

  const searchQuery = typeof query === "string" && query.trim() ? query.trim() : "meme";
  console.log("Fetching GIF from Giphy:", searchQuery);

  try {
    const response = await axios.get("https://api.giphy.com/v1/gifs/search", {
      params: {
        api_key: apiKey,
        q: searchQuery,
        limit: 10
      },
      timeout: 5000
    });

    const results = Array.isArray(response.data?.data) ? response.data.data : [];
    const randomGif = pickRandom(results);
    return randomGif?.images?.original?.url || null;
  } catch (error) {
    console.error("Giphy API request failed:", error.message);
    return null;
  }
}

module.exports = {
  searchGif
};
