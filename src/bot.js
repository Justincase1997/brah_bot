require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits } = require("discord.js");
const { getRandomMeme } = require("./memeEngine");
const { startTimer } = require("./delayManager");
const { handleCommand } = require("./commandHandler");
const { fetchRandomTenorGif } = require("./tenorService");

const CONFIG_PATH = path.resolve(__dirname, "..", "config", "config.json");

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(raw);
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

function isSelectedUser(userId, selectedUsers) {
  return Array.isArray(selectedUsers) && selectedUsers.includes(userId);
}

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
    memeRoot: config.memeRoot
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
    clientKey: config.tenorClientKey,
    limit: config.tenorSearchLimit
  });
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`brah_bot online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  let config;
  try {
    config = loadConfig();
  } catch (error) {
    console.error("Failed to load config/config.json:", error.message);
    return;
  }

  const commandHandled = await handleCommand({
    message,
    config,
    saveConfig
  });

  if (commandHandled) {
    return;
  }

  if (!config.enabled) {
    return;
  }

  if (!isSelectedUser(message.author.id, config.selectedUsers)) {
    return;
  }

  const delayMs = Math.max(0, Number(config.delaySeconds || 10) * 1000);
  const timerKey = `${message.guildId || "dm"}:${message.channelId}:${message.author.id}`;

  startTimer(timerKey, delayMs, async () => {
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
  });
});

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error("Missing DISCORD_BOT_TOKEN in environment.");
  process.exit(1);
}

client.login(token).catch((error) => {
  console.error("Discord login failed:", error.message);
  process.exit(1);
});
