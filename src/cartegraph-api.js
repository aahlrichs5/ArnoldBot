const Discord = require("discord.js");
const TOKEN = require("../config.json");
const fetch = require("node-fetch");
const bot = new Discord.Client();

bot.once("ready", () => {
  console.log("Ready Cartegraph");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;

  var args = message.content.substring(TOKEN.prefix.length).split(" ");

  parseMessage(args[0].toLocaleLowerCase(), message);
});

async function parseMessage(keyword, message) {
  const user = await authenticateCarte();
  message.channel.send(user);
}

async function authenticateCarte() {
  try {
    await fetch(
      `https://prodweb19-01.cartegraphoms.com/cobrakai/api/v1/authenticate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(TOKEN.carteAPI),
      }
    )
      .then(function (resp) {
        return resp.json();
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
  return `Authenticated user ${TOKEN.carteAPI.username} on prodweb/cobrakai.`;
}
