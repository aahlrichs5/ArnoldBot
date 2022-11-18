import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../command";
import Constants from "../../resources/constants";

export const userInfoCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get information about your discord account"),
  run: async (interaction) => {
    await interaction.deferReply();

    const user = interaction.user;

    const embedMessage = new MessageEmbed()
      .setColor(`#${Constants.embedColor}`)
      .setTitle(`${user.tag}`)
      .setThumbnail(`${user.avatarURL()}`)
      .addFields({
        name: "Created On",
        value: `${user.createdAt}`,
      });

    await interaction.editReply({ embeds: [embedMessage] });
  },
};
