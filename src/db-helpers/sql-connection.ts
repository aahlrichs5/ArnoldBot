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

  async testTableDescription() {
    try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect(sqlConfig);
      const result =
        await sql.query`SELECT description FROM testTable WHERE id = 1`;
      return result.recordset[0].description;
    } catch (err) {
      // ... error checks
      console.log(err);
    }
  }
}
