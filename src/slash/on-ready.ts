import { REST } from "@discordjs/rest";
import { Client, Intents } from "discord.js";
import { Routes } from "discord-api-types/v9";
require("dotenv").config();

import { CommandList } from "./command-list";

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

export const onReady = async (bot: Client) => {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  const commandData = CommandList.map((command) => command.data.toJSON());

  const guildList = bot.guilds.cache.map((guild) => guild.id);
  var guilds;

  for (const guildId of guildList) {
    guilds = await rest.put(Routes.applicationGuildCommands(bot.user?.id || "missing id", guildId), {
      body: commandData,
    });
  }

  console.log("Ready Slash Commands");
};
