const Discord = require("discord.js");
const fetch = require("node-fetch");
const KEYWORDS = require("../cg-constants.json");
const TOKEN = require("../config.json");
const bot = new Discord.Client();

const url = KEYWORDS.prodweb;
// const url = KEYWORDS.gemini;

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
  if (cookie === "") await authenticateCarte();

  switch (keyword) {
    case KEYWORDS.authenticate:
      const verified = await authenticateCarte();
      if (verified)
        message.channel.send(
          `Authenticated user ${TOKEN.carteAPI.username} on ${url}.`
        );
      else {
        message.channel.send(
          `Was unable to authenticate user ${TOKEN.carteAPI.username} on ${url}`
        );
      }
      break;
    case KEYWORDS.getPavement:
      getResourceByID(
        values,
        KEYWORDS.cgPavement,
        KEYWORDS.cgPavementClass,
        message
      );
      break;
    case KEYWORDS.newPavement:
      createNewResource(
        values,
        KEYWORDS.cgPavement,
        KEYWORDS.cgPavementClass,
        message
      );
      break;
    case KEYWORDS.getTask:
      getResourceByID(values, KEYWORDS.cgTasks, KEYWORDS.cgTasksClass, message);
      break;
    case KEYWORDS.newTask:
      createNewResource(
        values,
        KEYWORDS.cgTasks,
        KEYWORDS.cgTasksClass,
        message
      );
      break;
    case KEYWORDS.getFacilty:
      getResourceByID(
        values,
        KEYWORDS.cgFacilities,
        KEYWORDS.cgFacilitiesClass,
        message
      );
      break;
    case KEYWORDS.newFacility:
      createNewResource(
        values,
        KEYWORDS.cgFacilities,
        KEYWORDS.cgFacilitiesClass,
        message
      );
      break;
    case KEYWORDS.getPond:
      getResourceByID(values, KEYWORDS.cgPond, KEYWORDS.cgPondsClass, message);
      break;
    case KEYWORDS.newPond:
      createNewResource(
        values,
        KEYWORDS.cgPond,
        KEYWORDS.cgPondsClass,
        message
      );
      break;
    case KEYWORDS.getSign:
      getResourceByID(values, KEYWORDS.cgSigns, KEYWORDS.cgSignsClass, message);
      break;
    case KEYWORDS.newSign:
      createNewResource(
        values,
        KEYWORDS.cgSigns,
        KEYWORDS.cgSignsClass,
        message
      );
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
  const filter = `(([id] is equal to "${id}"))`;

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

async function createNewResource(id, type, typeClass, message) {
  var newResource;
  if (type !== KEYWORDS.cgTasks) {
    newResource = {
      [typeClass]: [
        {
          IDField: id,
        },
      ],
    };
  } else {
    newResource = {
      [typeClass]: [
        {
          IDField: id,
          ActivityField: "JustSomeWork",
        },
      ],
    };
  }

  try {
    await fetch(`${url}/classes/${typeClass}`, {
      method: "POST",
      headers: { cgkey: cookie },
      body: JSON.stringify(newResource),
    })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        sendEmbeddedMessage(data[Object.keys(data)[0]][0], type, message);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

async function createNewInspection(parentID, message) {}

function sendEmbeddedMessage(data, type, message) {
  const messageEmbed = new Discord.MessageEmbed()
    .setAuthor(
      "Cartegraph One",
      "https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png",
      "https://develop.cartegraphdev.com/"
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
      "Cartegraph One",
      "https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png",
      "https://develop.cartegraphdev.com/"
    )
    .setColor("#f78f1e")
    .setTitle("Help & Commands")
    .setThumbnail(
      `https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png`
    )
    .addFields(
      {
        name: "Supported Assets",
        value: `Pavement, Facility, Pond, and Sign.`,
      },
      {
        name: "~get{asset} {id}",
        value: `Find an existing asset with the given ID.`,
      },
      {
        name: "~getTask {id}",
        value: "Find a task with the given ID.",
      },
      {
        name: "~new{asset} {id}",
        value: `Create a new asset with the given ID.`,
      },
      {
        name: "~newTask {id}",
        value: "Create a new task with the given ID.",
      }
    );
  message.channel.send(messageEmbed);
}
