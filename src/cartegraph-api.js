const Discord = require("discord.js");
const fetch = require("node-fetch");
const KEYWORDS = require("../cg-constants.json");
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
  if (keyword === KEYWORDS.cgHelp) {
    sendHelpEmbed(message);
    return;
  }

  if (!values) {
    message.channel.send(
      "Please retry and enter an ID following the Cartegraph command."
    );
    return;
  }

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
      getResourceByID(
        values,
        KEYWORDS.cgPavement,
        KEYWORDS.cgPavementClass,
        message
      );
      break;
    case KEYWORDS.newPavement:
      if (cookie === "") await authenticateCarte();
      createNewPavement(values, message);
      break;
    case KEYWORDS.getTask:
      if (cookie === "") await authenticateCarte();
      getResourceByID(values, KEYWORDS.cgTasks, KEYWORDS.cgTasksClass, message);
      break;
    case KEYWORDS.getFacilty:
      if (cookie === "") await authenticateCarte();
      getResourceByID(
        values,
        KEYWORDS.cgFacilities,
        KEYWORDS.cgFacilitiesClass,
        message
      );
      break;
    case KEYWORDS.getPond:
      if (cookie === "") await authenticateCarte();
      getResourceByID(values, KEYWORDS.Pond, KEYWORDS.PondsClass, message);
      break;
    case KEYWORDS.getSign:
      if (cookie === "") await authenticateCarte();
      getResourceByID(values, KEYWORDS.cgSigns, KEYWORDS.cgSignsClass, message);
      break;
    case KEYWORDS.cgHelp:
      sendHelpEmbed(message);
      break;
    case KEYWORDS.cartegraph:
      message.channel.send("https://imgur.com/a/8842IVk");
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

async function getResourceByID(id, type, typeClass, message) {
  try {
    await fetch(`${url}/classes/${typeClass}?filter=${filter}`, {
      method: "GET",
      headers: { cgkey: cookie },
    })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        if (data[Object.keys(data)[0]][0] === undefined) {
          message.channel.send(
            `I couldn't find a ${type} with that ID. Please try again with a valid ID.`
          );
          return;
        }
        sendEmbeddedMessage(data[Object.keys(data)[0]][0], type, message);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

async function createNewPavement(id, message) {
  const type = KEYWORDS.cgPavement;
  const typeClass = KEYWORDS.cgPavementClass;

  try {
    await fetch(`${url}/classes/${typeClass}`, {
      method: "POST",
      headers: { cgkey: cookie },
      body: JSON.stringify({
        cgPavementClass: [
          {
            IDField: id,
          },
        ],
      }),
    })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        console.log(data);
        sendEmbeddedMessage(data[Object.keys(data)[0]][0], type, message);
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
    .setTitle(`${type} ID: ${data.IDField}`)
    .setThumbnail(
      `https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png`
    );
  if (data.Oid)
    messageEmbed.addFields({
      name: "Oid",
      value: `${data.Oid}`,
    });

  // Asset Fields
  if (data.cgAssetIDField)
    messageEmbed.addFields({
      name: "Asset ID",
      value: `${data.cgAssetIDField}`,
    });
  if (data.cgAssetTypeField)
    messageEmbed.addFields({
      name: "Asset Type",
      value: `${data.cgAssetTypeField}`,
    });
  if (data.PavementClassificationField)
    messageEmbed.addFields({
      name: "Pavement Classification",
      value: `${data.PavementClassificationField}`,
    });

  //Task Fields
  if (data.ActivityField)
    messageEmbed.addFields({
      name: "Task Type",
      value: `${data.ActivityField}`,
    });

  // Universal Fields
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
