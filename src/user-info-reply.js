const Discord = require("discord.js");
const KEYWORDS = require("./message-check.json");
const TOKEN = require("../config.json");
const bot = new Discord.Client();

bot.once("ready", () => {
  console.log("Ready UserInfoReply");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  // Checks for valid gif input
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;
  const args = message.content.substring(TOKEN.prefix.length).split(" ");
  if (args[0].toLowerCase() != KEYWORDS.userCheck) return;

  const messageEmbed = new Discord.MessageEmbed()
    .setAuthor(
      "ArnoldBot",
      "https://i.imgur.com/Dotbc16.png",
      "https://github.com/aahlrichs5/ArnoldBot"
    )
    .setColor("#ff0070")
    .setTitle(`${message.author.tag}`)
    .setThumbnail(`${message.author.avatarURL()}`)
    .addFields({
      name: "Created On",
      value: `${message.author.createdAt}`,
    });

  message.channel.send(messageEmbed);
});
