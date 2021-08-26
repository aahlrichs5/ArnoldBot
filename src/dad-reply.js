const Discord = require("discord.js");
const KEYWORDS = require("./message-check.json");
const TOKEN = require("../config.json");
const bot = new Discord.Client();

bot.once("ready", () => {
  console.log("Ready DadBot");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.author.bot) return;

  var words = message.content.toString().split(" ");
  findAndSend(words, message);
});

function findAndSend(words, message) {
  var result = "";
  var keywordCheck = -1;
  var keywordSpot = 0;

  for (i = 0; i < words.length && keywordCheck < 0; i++) {
    keywordCheck = KEYWORDS.dadCheck.indexOf(words[i]);
    keywordSpot = i;
  }

  for (i = keywordSpot + 1; i < words.length; i++) {
    result += ` ${words[i]}`;
  }

  if (keywordCheck >= 0) {
    message.channel.send(`Hi${result}, I'm Arnold Bot!`);
  }
}
