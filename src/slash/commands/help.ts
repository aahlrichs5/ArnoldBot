import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../command";

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Learn how to use Arnold Bot"),
  run: async (interaction) => {
    await interaction.deferReply();

    const embedMessage = new MessageEmbed()
      .setColor("#42f5a4")
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
