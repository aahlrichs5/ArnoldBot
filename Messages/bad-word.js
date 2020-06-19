const Discord = require("discord.js");
const TOKEN = require("./../config.json");
const KEYWORDS = require("./message-check.json");
const bot = new Discord.Client();

bot.once("ready", () => {
  console.log("Ready BadWord");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.author.bot) return;
  for (i = 0; i < KEYWORDS.badWords.length; i++) {
    if (message.content.includes(KEYWORDS.badWords[i])) {
      message.channel.send(
        `I'm watching you <@${message.author.id}>, do you want a spanking?`
      );
    }
  }
});

bot.on("message", (message) => {
  if (message.author.bot) return;
  for (i = 0; i < KEYWORDS.bannedWords.length; i++) {
    if (message.content.includes(KEYWORDS.bannedWords[i])) {
      message.delete();
      message.channel.send(
        `Sorry <@${message.author.username}>, you cant say that word here. Don't worry though, I already removed your message!`
      );
    }
  }
});
