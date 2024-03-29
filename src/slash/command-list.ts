import { REST } from "@discordjs/rest";
import { Client } from "discord.js";

import { Command } from "./command";
import { gifCommand } from "./commands/gif";
import { helloCommand } from "./commands/hello";
import { helpCommand } from "./commands/help";
import { userInfoCommand } from "./commands/user-info";

export const CommandList: Command[] = [gifCommand, helloCommand, helpCommand, userInfoCommand];

export const onReady = async (BOT: Client) => {
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN as string);
};
