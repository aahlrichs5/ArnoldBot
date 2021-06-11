const Discord = require("discord.js");
const TOKEN = require("../config.json");
const KEYWORDS = require("./message-check.json");
const bot = new Discord.Client();

bot.once("ready", () => {
  console.log("Ready BadWord");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.author.bot) return;
  var messageString = message.content.toString().toLowerCase();
  for (i = 0; i < KEYWORDS.badWords.length; i++) {
    if (messageString.includes(KEYWORDS.badWords[i])) {
      message.channel.send(
        `I'm watching you <@${message.author.id}>, do you want a spanking?`
      );
    }
  }
});

bot.on("message", (message) => {
  if (message.author.bot) return;
  var messageString = message.content.toString().toLowerCase();
  for (i = 0; i < KEYWORDS.bannedWords.length; i++) {
    if (messageString.includes(KEYWORDS.bannedWords[i])) {
      message.delete();
      message.channel.send(
        `Sorry <@${message.author.id}>, you cant say that word here. Don't worry though, I already removed your message!`
      );

      //logs to the mod log channel
      bot.channels.cache.get("846868428664340540").send(`@everyone, <@${message.author.id}> said ${message.content}, I deleted this message.`);
    }
  }
});
