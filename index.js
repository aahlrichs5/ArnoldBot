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
  if (message.content.toLowerCase().startsWith(`${TOKEN.prefix}help`)) {
    message.channel.send(
      `Commands: 
      !song, !hello
      
      Special Messages: 
      DadBot, LanguageChecker`
    );
  }
});

bot.on("message", (message) => {
  if (message.content.toLowerCase().startsWith(`${TOKEN.prefix}song`)) {
    message.channel.send(
      `Song Commands: 
      !play - plays a youtube link as a song 
      !skip - skips current song 
      !pause - pauses current song 
      !resume - resumes song from pause
      !reset - fixes queue if song is not playing
      !stop - clears queue and disconnects bot`
    );
  }
});

bot.on("message", (message) => {
  if (message.content.toLowerCase().startsWith(`${TOKEN.prefix}hello`)) {
    message.channel.send(`Hello, I am Arnold Bot!`);
  }
});
