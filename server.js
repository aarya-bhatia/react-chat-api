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

app.get("/contacts/:user_id", async (req, res, next) => {
  try {
    // fetch the chat_id's for user contacts
    const data = await knex("user_contact_cards").where(
      "user_id",
      req.params.user_id
    );
    // fetch messages containing above chat_id's
    // sort them according to the chat id
    // into chats object
    const messageRows = await knex("user_message_cards")
      .whereIn(
        "chat_id",
        data.map((row) => row.chat_id) // chat id list
      )
      .orderBy("created_at", "desc")
      .limit(100);

    let chats = {};

    messageRows.map((message) => {
      const chat_id = message.chat_id;

      if (chat_id in chats) {
        chats[chat_id].push(message);
      } else {
        chats[chat_id] = [message];
      }
    });

    // attach the messages list in the corresponding contacts
    res.json(
      data.map((row) => Object.assign({ messages: chats[row.chat_id] }, row))
    );
  } catch (err) {
    next(err);
  }
});

app.get("/messages/:chat_id", async (req, res, next) => {
  try {
    const rows = await knex.raw(
      `
        SELECT * FROM user_message_cards 
        WHERE chat_id = ${req.params.chat_id}
        ORDER BY created_at
        LIMIT ${req.query.limit ? req.query.limit : 20}
        OFFSET ${req.query.offset ? req.query.offset : 0}
      `
    );
    // offset by current number of messages
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.post("/messages/:chat_id", async (req, res, next) => {
  const { chat_id } = req.params;
  const { content, author_id } = req.body;
  try {
    const data = await knex("user_messages").insert({
      content,
      author_id,
      chat_id,
    });

    const rows = await knex("user_message_cards").where("id", data[0]);
    res.send(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json(err.message || { message: "Oops something went wrong" });
});

app.listen(port, () => console.log("running on port " + port));
