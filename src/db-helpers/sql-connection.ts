const sql = require("mssql/msnodesqlv8");

const sqlConfig = {
  database: "ArnoldBot",
  server: "localhost",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

export class SqlConnection {
  constructor() {}

  async exectueQuery(query: string) {
    try {
      await sql.connect(sqlConfig);
      const result = await sql.query(query);
      this.closeConnection();

      return result.recordset;
    } catch (err) {
      console.log(err);
      this.closeConnection();
      return null;
    }
  }

  async closeConnection() {
    await sql.close();
  }

  async getDescription() {
    const result = await this.exectueQuery(
      "SELECT description FROM testTable WHERE id = 1"
    );
    return result === null
      ? "There was an error processing the query"
      : result[0].description;
  }
}
