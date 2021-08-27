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
    createNewEmbed(
      ":x: Error",
      "Error Message:",
      "Please retry and enter an ID following the Cartegraph command.",
      message
    );
    return;
  }
  if (cookie === "") await authenticateCarte();

  switch (keyword) {
    case KEYWORDS.authenticate:
      const verified = await authenticateCarte();
      if (verified)
        createNewEmbed(
          ":white_check_mark: Authentication Success",
          "Success Message:",
          `Authenticated user ${TOKEN.carteAPI.username} on ${url}.`,
          message
        );
      else {
        createNewEmbed(
          "Authentication Error",
          `Was unable to authenticate user ${TOKEN.carteAPI.username} on ${url}`,
          "The service may temporarily be unavailable",
          message
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
    case KEYWORDS.newInspection:
      createNewInspection(values, message);
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
      createNewEmbed(
        ":x: Error Message",
        "I didn't recognize that Cartegraph command",
        `Type "~cgHelp" for a list of commands.`,
        message
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
          createNewEmbed(
            ":x: Error",
            `I couldn't find a ${type} with an ID of ${id}`,
            "Please try again with a valid ID.",
            message
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
        if (data[Object.keys(data)[0]][0].IDField === undefined) {
          createNewEmbed(
            ":x: Error",
            `A ${type} with the ID ${id} already exists`,
            `Please try creating another ${type} with a differnt ID.`,
            message
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

async function createNewInspection(parentID, message) {
  const rand = Math.floor(100000 + Math.random() * 900000);

  const newInspection = {
    [KEYWORDS.cgTasksClass]: [
      {
        cgAssetIDField: parentID,
        cgAssetTypeField: KEYWORDS.cgPavement,
        cgAssetAndIdField: `${KEYWORDS.cgPavement} ${parentID}`,
        IDField: rand,
        ActivityField: "Inspect",
      },
    ],
  };

  try {
    await fetch(`${url}/classes/${KEYWORDS.cgTasksClass}`, {
      method: "POST",
      headers: { cgkey: cookie },
      body: JSON.stringify(newInspection),
    })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        if (data[Object.keys(data)[0]][0].IDField === undefined) {
          createNewEmbed(
            ":x: Error",
            `I couldn't find a ${KEYWORDS.cgPavement} with dn ID of ${parentID}`,
            "Please try creating another inspection with a different parent ID.",
            message
          );
          return;
        }

        sendEmbeddedMessage(
          data[Object.keys(data)[0]][0],
          KEYWORDS.cgTasks,
          message
        );
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
    .setColor("#f78f1e")
    .setTitle(`:memo: ${type} ID: ${data.IDField}`)
    .setThumbnail(
      `https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png`
    );

  if (data.Oid) messageEmbed.addField("Oid", data.Oid);

  // Asset Fields
  if (data.cgAssetIDField)
    messageEmbed.addField("Asset ID", data.cgAssetIDField);
  if (data.cgAssetTypeField)
    messageEmbed.addField("Asset Type", data.cgAssetTypeField);
  if (data.PavementClassificationField)
    messageEmbed.addField(
      "Pavement Classification",
      data.PavementClassificationField
    );

  //Task Fields
  if (data.ActivityField)
    messageEmbed.addField("Task Type", data.ActivityField);
  if (data.StatusField) messageEmbed.addField("Status", data.StatusField);

  // Universal Fields
  if (data.EnteredByField)
    messageEmbed.addField("Entered By", data.EnteredByField);
  if (data.EntryDateField)
    messageEmbed.addField("Created On", data.EntryDateField);
  if (data.LastModifiedByField)
    messageEmbed.addField("Last Modified By", data.LastModifiedByField);
  if (data.cgLastModifiedField)
    messageEmbed.addField("Last Modified On", data.cgLastModifiedField);
  if (data.TotalCostField)
    messageEmbed.addField("Total Cost", `$${data.TotalCostField}`);
  message.channel.send(messageEmbed);
}

function sendHelpEmbed(message) {
  const messageEmbed = new Discord.MessageEmbed()
    .setColor("#f78f1e")
    .setTitle(":grey_question: Help & Commands")
    .setThumbnail(
      `https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png`
    )
    .addFields(
      {
        name: "Supported Assets",
        value: "Pavement, Facility, Pond, and Sign.",
      },
      {
        name: "~get{asset} {id}",
        value: "Find an existing asset with the given ID.",
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
      },
      {
        name: "~newInspection {id}",
        value:
          "Create a new pavement inspection for the pavement with the given ID.",
      }
    );
  message.channel.send(messageEmbed);
}

function createNewEmbed(header, title, content, message) {
  const messageEmbed = new Discord.MessageEmbed()
    .setColor("#f78f1e")
    .setTitle(`${header}`)
    .setThumbnail(
      `https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/1c/00/63/1c00639a-adef-aa09-f808-c567d7138cd6/AppIcon-1x_U007emarketing-0-7-0-85-220.png/400x400.png`
    )
    .addFields({
      name: `${title}`,
      value: `${content}`,
    });
  message.channel.send(messageEmbed);
}
