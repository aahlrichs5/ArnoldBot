import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

import Constants from "../../../resources/constants";
import { Command } from "../command";

export const helloCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Hello message from Arnold bot"),
  run: async (interaction) => {
    await interaction.deferReply();

    const embedMessage = new MessageEmbed();
    embedMessage.setTitle("Hello");
    embedMessage.setDescription("Hello, I am Arnold Bot!");
    embedMessage.setColor(`#${Constants.embedColor}`);

    await interaction.editReply({ embeds: [embedMessage] });
  },
};
