const Discord = require("discord.js");
const TOKEN = require("./../config.json");
const bot = new Discord.Client();

bot.once("ready", () => {
  console.log("Ready DadBot");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (!message.author.bot) {
    if (checkMessage(message)) {
      kite = message.content.toString();
      temp = kite.split(" ");

      let dog = (string = []);
      for (i = 0; i < temp.length; i++) {
        if (temp[i] == "im" || temp[i] == "i'm") {
          for (j = i + 1; j < temp.length; j++) {
            dog[j] = temp[j];
          }
        }
      }
      message.channel.send(`Hi${dog.join(" ")}, I'm Arnold Bot.`);
    }
  }
});

function checkMessage(message) {
  if (message.content.includes(`im `) || message.content.includes(`i'm `))
    return true;
}
