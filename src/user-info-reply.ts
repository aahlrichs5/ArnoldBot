import { Client, Intents, Message, MessageEmbed } from "discord.js";
const TOKEN = require("../config.json");
const KEYWORDS = require("./message-check.json");

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

bot.once("ready", () => {
  console.log("Ready UserInfoReply");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("messageCreate", (message: Message) => {
  // Checks for valid user command input
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;
  const args = message.content.substring(TOKEN.prefix.length).split(" ");
  if (args[0].toLowerCase() != KEYWORDS.userCheck) return;

  const messageEmbed = new MessageEmbed()
    .setAuthor({
      name: "ArnoldBot",
      iconURL: "https://i.imgur.com/Dotbc16.png",
      url: "https://github.com/aahlrichs5/ArnoldBot",
    })
    .setColor("#ff0070")
    .setTitle(`${message.author.tag}`)
    .setThumbnail(`${message.author.avatarURL()}`)
    .addFields({
      name: "Created On",
      value: `${message.author.createdAt}`,
    });

  message.channel.send({ embeds: [messageEmbed] });
});
