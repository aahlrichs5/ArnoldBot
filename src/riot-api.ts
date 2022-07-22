import { Client, Intents, Message } from "discord.js";
import fetch from "node-fetch";
const TOKEN = require("../config.json");
const KEYWORDS = require("./message-check.json");

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

bot.once("ready", () => {
  console.log("Ready RiotAPI");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("messageCreate", (message: Message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;
  const args = message.content.substring(TOKEN.prefix.length).split(" ");

  let summonerName = "";
  for (let i = 1; i < args.length; i++) {
    if (i === args.length - 1) summonerName += args[i].toString();
    else summonerName += args[i].toString() + " ";
  }
  if (
    summonerName == "" &&
    args[0].toLocaleLowerCase() !== KEYWORDS.leagueVersion
  )
    return;
  checkLeagueMessage(args[0].toLocaleLowerCase(), summonerName, message);
});

async function checkLeagueMessage(
  keyword: string,
  summonerName: string,
  message: Message
) {
  switch (keyword) {
    case KEYWORDS.leagueLevel:
      await fetchSummonerLevel(summonerName, message);
      break;
    // TODO find actual rank
    // case KEYWORDS.leagueRank:
    //   const summonerRank = await fetchRank(summonerName, message);
    //   break;
    case KEYWORDS.leagueVersion:
      const gameVersion = await fetchGameVersion(message);
      message.channel.send(`League of Legends is on patch ${gameVersion}`);
      break;
    case KEYWORDS.champMastery:
      const champID = await fetchChampionID(summonerName, message);
      console.log(champID);
      break;
  }
}

async function fetchChampionID(championName: string, message: Message) {
  const gameVersion = await fetchGameVersion(message);

  try {
    await fetch(
      `http://ddragon.leagueoflegends.com/cdn/${gameVersion}/data/en_US/champion.json`
    )
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        const champData = data.data[championName].key;
        const allData = data.data;
        console.log(allData);
        console.log(champData);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

async function fetchGameVersion(message: Message) {
  let version;
  try {
    await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        version = data;
      })
      .catch((error) => {
        console.log(error);
      });
    if (version) return version[0];
  } catch (error) {
    message.channel.send("Error finding game version for league of legends.");
  }
}

async function fetchSummonerLevel(summonerName: string, message: Message) {
  let summonerLevel;
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

// async function fetchSummonerID(summonerName) {
//   let summonerID;
//   try {
//     await fetch(
//       `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}/?api_key=${TOKEN.riotKey}`
//     )
//       .then(function (resp) {
//         return resp.json();
//       })
//       .then(function (data) {
//         summonerID = data.id;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//     console.log(summonerID);
//     return summonerID;
//   } catch (error) {
//     console.log("Can't find summoner ID");
//   }
// }

// async function fetchRank(summonerID) {}
