import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import { CommandList } from "./command-list";
const TOKEN = require("../../config.json");

export const onReady = async (bot: Client) => {
  const rest = new REST({ version: "10" }).setToken(TOKEN.token);

  const commandData = CommandList.map((command) => command.data.toJSON());

  await rest.put(
    Routes.applicationGuildCommands(
      bot.user?.id || "missing id",
      TOKEN.guildId
    ),
    { body: commandData }
  );

  console.log("Ready Slash Commands");
};
