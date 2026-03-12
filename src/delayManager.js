const { getRandomMeme } = require("./memeEngine");
const { fetchRandomTenorGif } = require("./tenorService");

const timers = new Map();

function isUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

async function sendMeme(channel, memeValue) {
  if (isUrl(memeValue)) {
    await channel.send(memeValue);
    return;
  }

  await channel.send({ files: [memeValue] });
}

async function pickMeme(config) {
  const localMeme = await getRandomMeme({
    memeRoot: config.memeRoot || "memes"
  });

  if (localMeme) {
    return localMeme;
  }

  if (!config.tenorEnabled) {
    return null;
  }

  return fetchRandomTenorGif({
    query: config.tenorQuery || "meme",
    apiKey: config.tenorApiKey,
    clientKey: config.tenorClientKey || "brah_bot",
    limit: config.tenorSearchLimit || 20
  });
}

function queueMessageForDelay({ message, config }) {
  const userId = message.author.id;

  if (timers.has(userId)) {
    clearTimeout(timers.get(userId));
  }

  const delayMs = Math.max(0, Number(config.delaySeconds || 10) * 1000);

  const timeoutId = setTimeout(async () => {
    timers.delete(userId);

    try {
      const meme = await pickMeme(config);
      if (!meme) {
        console.warn("No meme available (local or Tenor fallback).");
        return;
      }

      await message.channel.sendTyping();
      await sendMeme(message.channel, meme);
    } catch (error) {
      console.error("Failed to send meme:", error.message);
    }
  }, delayMs);

  timers.set(userId, timeoutId);
}

function cancelUserTimer(userId) {
  if (!timers.has(userId)) {
    return false;
  }

  clearTimeout(timers.get(userId));
  timers.delete(userId);
  return true;
}

module.exports = {
  queueMessageForDelay,
  cancelUserTimer
};
