/* eslint-disable no-unused-vars */
import { Client, Intents, MessageEmbed } from "discord.js";
const TOKEN = require("../config.json");
const badWord = require("./bad-word.ts");
const cartegraph = require("./cartegraph-api.ts");
const dadBot = require("./dad-reply.ts");
const gifReply = require("./gif-reply.ts");
const riotAPI = require("./riot-api.ts");
const userInfoReply = require("./user-info-reply.ts");

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// Logging when bot is online
bot.once("ready", () => {
  console.log("Ready Index");
  bot.user.setActivity("!help");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith(`${TOKEN.prefix}help`)) {
    const embedMessage = new MessageEmbed()
      .setAuthor({
        name: "ArnoldBot",
        iconURL: "https://i.imgur.com/Dotbc16.png",
        url: "https://github.com/aahlrichs5/ArnoldBot",
      })
      .setColor("#ff0070")
      .setTitle("ArnoldBot Help:")
      .setThumbnail("https://i.imgur.com/Dotbc16.png")
      .addFields(
        { name: "!hello", value: "I'll send a greeting" },
        {
          name: "!gif",
          value: "I'll send a gif of the keyword following the command",
        },
        { name: "!user", value: "I'll send info about your discord account" }
      );
    message.channel.send({ embeds: [embedMessage] });
  }

  if (message.content.toLowerCase().startsWith(`${TOKEN.prefix}hello`)) {
    message.channel.send(`Hello, I am Arnold Bot!`);
  }
});
