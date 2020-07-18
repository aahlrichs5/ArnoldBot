const Discord = require("discord.js");
const TOKEN = require("./config.json");
const dadBot = require("./Messages/dad-reply");
const badWord = require("./Messages/bad-word");
const gifReply = require("./Messages/gif-reply");
const userInfoReply = require("./Messages/user-info-reply");
const riotAPI = require("./Messages/riot-api");
const bot = new Discord.Client();

// Logging when bot is online
bot.once("ready", () => {
  console.log("Ready Index");
  bot.user.setActivity("!help");
  bot.user.set;
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.content.toLowerCase().startsWith(`${TOKEN.prefix}help`)) {
    const embedMessage = new Discord.MessageEmbed()
      .setAuthor(
        "ArnoldBot",
        "https://i.imgur.com/Dotbc16.png",
        "https://github.com/aahlrichs5/ArnoldBot"
      )
      .setColor("#ff0070")
      .setTitle("ArnoldBot Help:")
      .setThumbnail("https://i.imgur.com/Dotbc16.png")
      .addFields(
        { name: "!hello", value: "I'll send a greeting" },
        {
          name: "!gif",
          value: "I'll send a gif of the keyword following the command",
        },
        { name: "!user", value: "I'll send info about your discord account" },
        { name: "dadBot", value: "I'm a dad, but I have no kids..." },
        { name: "languageFilterBot", value: "Watch your profanity" }
      );
    message.channel.send(embedMessage);
  }
});

bot.on("message", (message) => {
  if (message.content.toLowerCase().startsWith(`${TOKEN.prefix}hello`)) {
    message.channel.send(`Hello, I am Arnold Bot!`);
  }
});
