import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

import Constants from "../../../resources/constants";
import { Command } from "../command";

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Learn how to use Arnold Bot"),
  run: async (interaction) => {
    await interaction.deferReply();

    const embedMessage = new MessageEmbed()
      .setColor(`#${Constants.embedColor}`)
      .setTitle("ArnoldBot Help")
      .setThumbnail("https://i.imgur.com/rZeTEsD.png")
      .addFields(
        { name: "/hello", value: "I'll send a greeting" },
        {
          name: "/gif {keyword}",
          value: "I'll send a random gif of the keyword following the command",
        },
        { name: "/user", value: "I'll send info about your discord account" }
      );

    await interaction.editReply({ embeds: [embedMessage] });
  },
};
