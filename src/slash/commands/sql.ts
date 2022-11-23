import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../command";

import { SqlConnection } from "../../db-helpers/sql-connection";

export const sqlCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("sql")
    .setDescription("Fetch something from the ArnoldBot database"),
  run: async (interaction) => {
    await interaction.deferReply();

    const sql = new SqlConnection();

    const result = await sql.testTableDescription();

    await interaction.editReply(result);
  },
};
