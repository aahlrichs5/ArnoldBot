const Discord = require("discord.js");
const TOKEN = require("./config.json");
const playSong = require("./Commands/play-song");
const dadBot = require("./Messages/dad-reply");
const bot = new Discord.Client();

// Logging when bot is online
bot.once("ready", () => {
  console.log("Ready Index");
});

bot.login(TOKEN.token); // logs in with the token

// Test funtion when !test is written the bot will reply
bot.on("message", (message) => {
  if (message.content.startsWith(`${TOKEN.prefix}test`)) {
    message.channel.send("beep boop");
  }
});

bot.on("message", (message) => {
  if (message.content.startsWith(`${TOKEN.prefix}hello`)) {
    message.channel.send("Hello, I am Arnold Bot!");
  }
});
