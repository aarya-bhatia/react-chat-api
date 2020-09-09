const knex = require("./db/knex");
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/users/:id", (req, res, next) => {
  knex("user_profiles")
    .where("user_id", req.params.id)
    .then((rows) => {
      const user = rows[0];
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/contacts/:user_id", (req, res, next) => {
  knex("user_contact_cards")
    .where("user_id", req.params.user_id)
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/messages/:chat_id", async (req, res, next) => {
  knex
    .raw(
      `
          SELECT * FROM user_message_cards 
          WHERE chat_id = ${req.params.chat_id}
          ORDER BY created_at
          LIMIT 20;
      `
    )
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      next(err);
    });
});

app.use((err, req, res, next) => {
  res.status(500).json(err);
});

app.listen(port, () => console.log("running on port " + port));
