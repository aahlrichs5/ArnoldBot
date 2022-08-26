import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
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

    await interaction.editReply({ embeds: [embedMessage] });
  },
};
