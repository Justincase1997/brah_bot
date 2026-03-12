require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { searchGif } = require("./giphyService");
const { detectKeyword } = require("./messageAnalyzer");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("clientReady", () => {
  console.log(`brah_bot online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  console.log(`Message received from ${message.author.username}: ${message.content}`);
  console.log("Starting 10-second delay before GIF response...");

  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log("Delay complete. Detecting keyword...");

    const keyword = detectKeyword(message.content);
    console.log("Detected keyword:", keyword);

    console.log("Searching Giphy...");
    const gifUrl = await searchGif(keyword);
    if (!gifUrl) {
      console.warn(`No GIF found for keyword: ${keyword}`);
      return;
    }

    console.log("Sending typing indicator...");
    await message.channel.sendTyping();

    console.log("GIF found. Sending to channel...");
    await message.channel.send(gifUrl);
    console.log("GIF sent successfully.");
  } catch (error) {
    console.error("Failed to send GIF response:", error.message);
  }
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
