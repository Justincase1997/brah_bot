require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { searchGif } = require("./giphyService");

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

  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await message.channel.sendTyping();

    const gifUrl = await searchGif("meme");
    if (!gifUrl) {
      console.warn("No GIF found for query: meme");
      return;
    }

    await message.channel.send(gifUrl);
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
