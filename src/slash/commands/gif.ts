import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../command";
import fetch from "node-fetch";
const TOKEN = require("../../../config.json");

export const gifCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Return a random gif from a given keyword")
    .addStringOption((option) =>
      option
        .setName("keyword")
        .setDescription("The query for a gif search")
        .setRequired(true)
    ),
  run: async (interaction) => {
    await interaction.deferReply();
    const text = interaction.options.getString("keyword", true);

    try {
      const gif = await getGifFromAPI(text);
      await interaction.editReply(gif);
    } catch (error) {
      await interaction.editReply("I couldn't find a gif with that keyword.");
    }
  },
};

async function getGifFromAPI(content: string) {
  var gifUrl: GifObject[] = [];

  await fetch(
    `https://api.tenor.com/v1/search?q=${content}&key=${TOKEN.tenorKey}&limit=${TOKEN.tenorLimit}`
  )
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      gifUrl = data.results;
    })
    .catch((error) => {
      console.log(error);
    });

  const randomNum = Math.floor(Math.random() * gifUrl.length);
  return gifUrl[randomNum].itemurl;
}

type GifObject = {
  itemurl: string;
};
