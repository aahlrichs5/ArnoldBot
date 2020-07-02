const Discord = require("discord.js");
const TOKEN = require("./../config.json");
const KEYWORDS = require("./message-check.json");
const fetch = require("node-fetch");
const bot = new Discord.Client();

bot.once("ready", () => {
  console.log("Ready UserInfoReply");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  // Checks for valid gif input
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;
  let args = message.content.substring(TOKEN.prefix.length).split(" ");
  if (args[0].toLowerCase() != KEYWORDS.userCheck) return;

  message.channel.send("hello");
});
