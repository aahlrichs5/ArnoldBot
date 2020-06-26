const Discord = require("discord.js");
const TOKEN = require("./../config.json");
const KEYWORDS = require("./message-check.json");
const fetch = require("node-fetch");
const bot = new Discord.Client();

var gifUrl;

bot.once("ready", () => {
  console.log("Ready GifReply");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;
  let args = message.content.substring(TOKEN.prefix.length).split(" ");
  if (args[1] === undefined) {
    message.channel.send("Provide what type of gif you would like me to send.");
    return;
  }
  if (args[0].localeCompare("gif") === 0) replyWithGif(args[1], message);
});

async function replyWithGif(content, message) {
  const file = await getGifFromAPI(content);
  // console.log(file);

  //   var requestGif = JSON.parse(file);
  //   console.log(requestGif);
}

async function getGifFromAPI(content) {
  return await fetch(
    `https://api.tenor.com/v1/search?q=${content}&key=${TOKEN.tenorKey}&limit=1`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      // console.log(data);
      gifUrl = data.results;
      console.log(Object.getOwnPropertyNames(gifUrl));
      console.log(gifUrl);
    });
}
