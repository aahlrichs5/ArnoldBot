const Discord = require("discord.js");
const fetch = require("node-fetch");
const KEYWORDS = require("./message-check.json");
const TOKEN = require("../config.json");
const bot = new Discord.Client();

const url = "https://prodweb19-01.cartegraphoms.com/cobrakai/api/v1";

var cookie = "";

bot.once("ready", () => {
  console.log("Ready Cartegraph");
});

bot.login(TOKEN.token); // logs in with the token

bot.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(TOKEN.cgPrefix) !== 0) return;

  var args = message.content.substring(TOKEN.cgPrefix.length).split(" ");

  const values = message.content.replace(
    `${TOKEN.cgPrefix}` + args[0] + " ",
    ""
  );
  processMessage(args[0].toLocaleLowerCase(), values, message);
});

async function processMessage(keyword, values, message) {
  console.log(keyword, values, message.content);
  switch (keyword) {
    case KEYWORDS.authenticate:
      const verified = await authenticateCarte();
      if (verified)
        message.channel.send(
          `Authenticated user ${TOKEN.carteAPI.username} on prodweb/cobrakai.`
        );
      break;
    case KEYWORDS.getPavement:
      if (cookie === "") await authenticateCarte();
      if (!values) {
        message.channel.send(
          "Please retry and enter an ID following the !getpavement command."
        );
        return;
      }
      getPavementByID(values, message);
      break;
    case KEYWORDS.getTask:
      if (cookie === "") await authenticateCarte();
      if (!values) {
        message.channel.send(
          "Please retry and enter an ID following the !gettask command."
        );
        return;
      }
      getTaskByID(values, message);
      break;
    case KEYWORDS.cgHelp:
      sendHelpEmbed(message);
      break;
    default:
      message.channel.send(
        `I didn't recognize that Cartegraph command. Type "~cgHelp" for a list of commands.`
      );
  }
}

async function authenticateCarte() {
  try {
    await fetch(`${url}/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TOKEN.carteAPI),
    })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        cookie = data.Cookie;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

async function getPavementByID(id, message) {
  const filter = `(([id] is equal to "${id}"))`;
  try {
    await fetch(`${url}/classes/cgPavementClass?filter=${filter}`, {
      method: "GET",
      headers: { cgkey: cookie },
    })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        if (data.Message) {
          message.channel.send(
            `Authentication required for Cartegraph's API access may have expired. Try typing "!auth" first.`
          );
          return;
        }
        if (data.cgPavementClass[0].IDField === undefined) {
          message.channel.send(
            "I couldn't find a pavement asset with that ID. Please try again with a valid ID."
          );
          return;
        }
        sendEmbeddedMessage(data.cgPavementClass[0], "Pavement", message);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

async function getTaskByID(id, message) {
  const filter = `(([id] is equal to "${id}"))`;
  try {
    await fetch(`${url}/classes/cgTasksClass?filter=${filter}`, {
      method: "GET",
      headers: { cgkey: cookie },
    })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        if (data.Message) {
          message.channel.send(
            `Authentication required for Cartegraph's API access may have expired. Try typing "!auth" first.`
          );
          return;
        }
        if (data.cgTasksClass[0].IDField === undefined) {
          message.channel.send(
            "I couldn't find a task with that ID. Please try again with a valid ID."
          );
          return;
        }
        sendEmbeddedMessage(data.cgTasksClass[0], "Task", message);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

function sendEmbeddedMessage(data, type, message) {
  const messageEmbed = new Discord.MessageEmbed()
    .setAuthor(
      "Cartegraph.com",
      "https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png",
      "https://www.cartegraph.com/"
    )
    .setColor("#f78f1e")
    .setTitle(`${type}: ${data.IDField}`)
    .setThumbnail(
      `https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png`
    );
  if (data.Oid)
    messageEmbed.addFields({
      name: "Oid",
      value: `${data.Oid}`,
    });
  if (data.EnteredByField)
    messageEmbed.addFields({
      name: "Entered By",
      value: `${data.EnteredByField}`,
    });
  if (data.EntryDateField)
    messageEmbed.addFields({
      name: "Created On",
      value: `${data.EntryDateField}`,
    });
  if (data.LastModifiedByField)
    messageEmbed.addFields({
      name: "Last Modified By",
      value: `${data.LastModifiedByField}`,
    });
  if (data.cgLastModifiedField)
    messageEmbed.addFields({
      name: "Last Modified On",
      value: `${data.cgLastModifiedField}`,
    });
  if (data.TotalCostField)
    messageEmbed.addFields({
      name: "Total Cost",
      value: `$${data.TotalCostField}`,
    });
  message.channel.send(messageEmbed);
}

function sendHelpEmbed(message) {
  const messageEmbed = new Discord.MessageEmbed()
    .setAuthor(
      "Cartegraph.com",
      "https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png",
      "https://www.cartegraph.com/"
    )
    .setColor("#f78f1e")
    .setTitle(`Cartegraph Commands`)
    .setThumbnail(
      `https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png`
    )
    .addFields(
      {
        name: "~getPavement {id}",
        value: "Find a pavement with the given ID.",
      },
      {
        name: "~getTask {id}",
        value: "Find a task with the given ID.",
      }
    );
  message.channel.send(messageEmbed);
}
