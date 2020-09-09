// config settings
module.exports.development = {
  client: "sqlite3",
  connection: function () {
    return {
      filename: __dirname + "/db/data.sqlite3",
    };
  },
  migrations: {
    directory: __dirname + "/db/migrations",
  },
  seeds: {
    directory: __dirname + "/db/seeds",
  },
  useNullAsDefault: true,
};
