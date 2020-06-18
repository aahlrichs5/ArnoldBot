const Discord = require("discord.js");
const TOKEN = require("./config.json");
const playSong = require("./Commands/play-song");
const dadBot = require("./Messages/dad-reply");
const badWord = require("./Messages/bad-word");
const bot = new Discord.Client();

// Logging when bot is online
bot.once("ready", () => {
  console.log("Ready Index");
  bot.user.setActivity("!help");
  bot.user.set;
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.content.startsWith(`${TOKEN.prefix}help`)) {
    message.channel.send(
      "Commands: !play followed by a youtube URL to play a song, !hello \n Special Messages: DadBot, LanguageChecker"
    );
  }
});

bot.on("message", (message) => {
  if (message.content.startsWith(`${TOKEN.prefix}hello`)) {
    message.channel.send("Hello, I am Arnold Bot!");
  }
});
