const Discord = require("discord.js");
const fetch = require("node-fetch");
const KEYWORDS = require("./message-check.json");
const TOKEN = require("../config.json");
const bot = new Discord.Client();

let gifUrl;

bot.once("ready", () => {
  console.log("Ready GifReply");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  // Checks for valid gif input
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;
  const args = message.content.substring(TOKEN.prefix.length).split(" ");
  if (args[0].toLowerCase() != KEYWORDS.gifCheck) return;

  // Makes sure a keyword was provided
  if (args[1] === undefined) {
    message.channel.send("Provide what type of gif you would like me to send.");
    return;
  }

  //puts the message into a string without the "!gif"
  let gifString = "";
  for (let i = 1; i < args.length; i++) {
    if (i === args.length - 1) gifString += args[i].toString();
    else gifString += args[i].toString() + " ";
  }
  replyWithGif(gifString, message);
});

async function replyWithGif(content, message) {
  try {
    const gif = await getGifFromAPI(content);
    message.channel.send(
      `Here is your gif ${message.author.username}. \n ${gif}`
    );
  } catch (error) {
    message.channel.send(
      `I couldn't find a gif with that keyword ${message.author.username}.`
    );
  }
}

async function getGifFromAPI(content) {
  await fetch(
    `https://api.tenor.com/v1/search?q=${content}&key=${TOKEN.tenorKey}&limit=${TOKEN.tenorLimit}`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      gifUrl = data.results;
    })
    .catch((error) => {
      console.log(error);
    });
  const randomNum = Math.floor(Math.random() * gifUrl.length);
  return gifUrl[randomNum].itemurl;
}
