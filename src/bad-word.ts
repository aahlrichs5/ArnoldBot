import { Client, Intents, Message } from "discord.js";
require("dotenv").config();

const CONFIG = require("../config.json");

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

bot.once("ready", () => {
  console.log("Ready BadWord");
});

bot.login(process.env.TOKEN); // logs in with the token

bot.on("messageCreate", (message: Message) => {
  if (message.author.bot) return;

  const messageString = message.content.toString().toLowerCase();
  for (let i = 0; i < CONFIG.badWords.length; i++) {
    if (messageString.includes(CONFIG.badWords[i])) {
      message.channel.send(`I'm watching you <@${message.author.id}>!`);
    }
  }

  for (let i = 0; i < CONFIG.bannedWords.length; i++) {
    if (messageString.includes(CONFIG.bannedWords[i])) {
      message.delete();
      message.channel.send(
        `Sorry <@${message.author.id}>, you cant say that word here. Don't worry though, I already removed your message!`,
      );
    }
  }
});
