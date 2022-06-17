const { Client, Intents } = require("discord.js");
const KEYWORDS = require("./message-check.json");
const TOKEN = require("../config.json");
const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

bot.once("ready", () => {
  console.log("Ready DadBot");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const words = message.content.toString().split(" ");
  findAndSend(words, message);
});

function findAndSend(words, message) {
  let result = "";
  let keywordCheck = -1;
  let keywordSpot = 0;

  for (let i = 0; i < words.length && keywordCheck < 0; i++) {
    keywordCheck = KEYWORDS.dadCheck.indexOf(words[i]);
    keywordSpot = i;
  }

  for (let i = keywordSpot + 1; i < words.length; i++) {
    result += ` ${words[i]}`;
  }

  if (keywordCheck >= 0) {
    message.channel.send(`Hi${result}, I'm Arnold Bot!`);
  }
}
