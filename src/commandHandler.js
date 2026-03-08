const { PermissionsBitField } = require("discord.js");

function getMentionedOrRawUserId(message, args) {
  const mentioned = message.mentions.users.first();
  if (mentioned) {
    return mentioned.id;
  }

  const candidate = args[1];
  if (candidate && /^\d{5,}$/.test(candidate)) {
    return candidate;
  }

  return null;
}

function isAdmin(message, adminRoleName) {
  if (!message.guild || !message.member) {
    return false;
  }

  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return true;
  }

  return message.member.roles.cache.some((role) => role.name === adminRoleName);
}

async function handleCommand({ message, config, saveConfig }) {
  if (!message.content.startsWith("!")) {
    return false;
  }

  const args = message.content.trim().split(/\s+/);
  const command = args[0].toLowerCase();
  const supportedCommands = new Set([
    "!enablebot",
    "!disablebot",
    "!addfriend",
    "!removefriend",
    "!listfriends"
  ]);

  if (!supportedCommands.has(command)) {
    return false;
  }

  if (!isAdmin(message, config.adminRole)) {
    await message.reply("Only admins can run bot commands.");
    return true;
  }

  switch (command) {
    case "!enablebot":
      config.enabled = true;
      saveConfig(config);
      await message.reply("brah_bot enabled.");
      return true;
    case "!disablebot":
      config.enabled = false;
      saveConfig(config);
      await message.reply("brah_bot disabled.");
      return true;
    case "!addfriend": {
      const userId = getMentionedOrRawUserId(message, args);
      if (!userId) {
        await message.reply("Usage: !addfriend @user");
        return true;
      }

      if (!Array.isArray(config.selectedUsers)) {
        config.selectedUsers = [];
      }

      if (!config.selectedUsers.includes(userId)) {
        config.selectedUsers.push(userId);
        saveConfig(config);
      }

      await message.reply(`Added friend: <@${userId}>`);
      return true;
    }
    case "!removefriend": {
      const userId = getMentionedOrRawUserId(message, args);
      if (!userId) {
        await message.reply("Usage: !removefriend @user");
        return true;
      }

      if (!Array.isArray(config.selectedUsers)) {
        config.selectedUsers = [];
      }

      config.selectedUsers = config.selectedUsers.filter((id) => id !== userId);
      saveConfig(config);
      await message.reply(`Removed friend: <@${userId}>`);
      return true;
    }
    case "!listfriends": {
      const selectedUsers = Array.isArray(config.selectedUsers) ? config.selectedUsers : [];
      if (!selectedUsers.length) {
        await message.reply("No selected users configured.");
        return true;
      }

      const mentions = selectedUsers.map((id) => `<@${id}>`).join(", ");
      await message.reply(`Selected users: ${mentions}`);
      return true;
    }
    default:
      return false;
  }
}

module.exports = {
  handleCommand
};
