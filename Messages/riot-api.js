const Discord = require("discord.js");
const TOKEN = require("./../config.json");
const KEYWORDS = require("./message-check.json");
const fetch = require("node-fetch");
const bot = new Discord.Client();

bot.once("ready", () => {
  console.log("Ready RiotAPI");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;
  var args = message.content.substring(TOKEN.prefix.length).split(" ");

  var summonerName = "";
  for (var i = 1; i < args.length; i++) {
    if (i === args.length - 1) summonerName += args[i].toString();
    else summonerName += args[i].toString() + " ";
  }
  checkLeagueMessage(args[0].toLocaleLowerCase(), summonerName);
});

async function checkLeagueMessage(keyword, summonerName) {
  summonerID = "";
  if (summonerName == "") return;
  switch (keyword) {
    case KEYWORDS.leagueProfile:
      summonerID = await fetchSummonerID(summonerName);
      await fetchProfile(summonerID);
      break;
    case KEYWORDS.leagueLevel:
      summonerID = await fetchSummonerID(summonerName);
      await fetchLevel(summonerID);
      break;
    case KEYWORDS.leagueRank:
      summonerID = await fetchSummonerID(summonerName);
      await fetchRank(summonerID);
      break;
  }
}

async function fetchSummonerID(summonerName) {
  try {
    await fetch(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}/?api_key=${TOKEN.riotKey}`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        summonerID = data.id;
      })
      .catch((error) => {
        console.log(error);
      });
    //console.log(summonerID);
    return summonerID;
  } catch (error) {
    console.log("error");
  }
}

async function fetchProfile(summonerID) {}

async function fetchLevel(summonerID) {}

async function fetchRank(summonerID) {}
