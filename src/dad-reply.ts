import { Client, Intents, Message } from "discord.js";
const TOKEN = require("../config.json");
const KEYWORDS = require("../message-check.json");

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

bot.once("ready", () => {
  console.log("Ready DadBot");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("messageCreate", (message: Message) => {
  if (message.author.bot) return;

  const words = message.content.toString().split(" ");
  findAndSend(words, message);
});

function findAndSend(words: string[], message: Message) {
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
