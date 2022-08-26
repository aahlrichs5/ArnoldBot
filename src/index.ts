/* eslint-disable no-unused-vars */
import { Client, Intents } from "discord.js";
import { botInteraction } from "./slash/interaction";
import { onReady } from "./slash/on-ready";
const TOKEN = require("../config.json");
const badWord = require("./bad-word.ts");
const cartegraph = require("./cartegraph-api.ts");
const dadBot = require("./dad-reply.ts");
const riotAPI = require("./riot-api.ts");
const userInfoReply = require("./user-info-reply.ts");

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

// Logging when bot is online
bot.once("ready", async () => {
  await onReady(bot);
  bot.user.setActivity("with Slash Commands");
});

bot.login(TOKEN.token); // logs in with the token

bot.on(
  "interactionCreate",
  async (interaction) => await botInteraction(interaction)
);
