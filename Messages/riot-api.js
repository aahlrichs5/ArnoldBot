const Discord = require("discord.js");
const TOKEN = require("./../config.json");
const KEYWORDS = require("./message-check.json");
const fetch = require("node-fetch");
const bot = new Discord.Client();

const gameVersion = "10.16.1";

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
  checkLeagueMessage(args[0].toLocaleLowerCase(), summonerName, message);
});

async function checkLeagueMessage(keyword, summonerName, message) {
  if (summonerName == "") return;
  switch (keyword) {
    // TODO fix profile
    case KEYWORDS.leagueProfile:
      const summonerID = await fetchSummonerID(summonerName, message);
      break;
    case KEYWORDS.leagueLevel:
      await fetchSummonerLevel(summonerName, message);
      break;
    // TODO find actual rank
    case KEYWORDS.leagueRank:
      const summonerRank = await fetchSummonerRank(summonerName, message);
      break;
  }
}

async function fetchSummonerID(summonerName, message) {
  try {
    await fetch(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}/?api_key=${TOKEN.riotKey}`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        summonerID = data;
      })
      .catch((error) => {
        console.log(error);
      });
    return summonerID;
  } catch (error) {
    message.channel.send("Error: Cannot find summoner name.");
  }
}

async function fetchSummonerLevel(summonerName, message) {
  try {
    await fetch(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}/?api_key=${TOKEN.riotKey}`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        summonerLevel = data.summonerLevel;
      })
      .catch((error) => {
        console.log(error);
      });
    if (summonerLevel !== undefined)
      message.channel.send(
        `${summonerName} is level ${summonerLevel} in League of Legends.`
      );
    else message.channel.send("Could not find level of that summoner name.");
  } catch (error) {
    message.channel.send("Error: Cannot find level for that summoner name.");
  }
}

async function fetchRank(summonerID) {}

async function getChampionID() {
  try {
    await fetch(
      `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/champion.json`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        champID = data;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(champID);
  } catch (error) {
    console.log(error);
  }
}
