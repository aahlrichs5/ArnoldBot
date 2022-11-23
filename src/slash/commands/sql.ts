import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../command";

import { SqlConnection } from "../../db-helpers/sql-connection";

export const sqlCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("sql")
    .setDescription("Fetch something from the ArnoldBot database")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The query to execute")
        .setRequired(true)
    ),
  run: async (interaction) => {
    await interaction.deferReply();
    const query = interaction.options.getString("query", true);
    const sql = new SqlConnection();
    var result = "";

    switch (query) {
      case "description":
        result = await sql.getDescription();
        break;
      default:
        result = "Invalid Query";
    }

    await interaction.editReply(result);
  },
};
