const knex = require("./db/knex");
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  // name can be used as email
  try {
    const data = await knex("user_accounts").whereRaw("email = ? or name = ?", [
      email,
      email,
    ]);
    const user = data[0];
    if (!user) {
      return res.status(400).json({ message: "email or name does not exist" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "password is incorrect" });
    }

    const { user_id } = user;
    const user_profile_row = await knex("user_profiles").where(
      "user_id",
      user_id
    );
    await knex("user_logs").insert({ user_id, type: "LOGIN" });
    res.locals.user_id = user_id;
    res.status(200).json(user_profile_row[0]);
  } catch (err) {
    next(err);
  }
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
        chats[chat_id].unshift(message);
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

app.post("/signout", async (req, res, next) => {
  const { user_id } = res.locals;
  try {
    await knex("user_logs").insert({ user_id, type: "LOGOUT" });
    res.locals.user_id = null;
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json(err.message || { message: "Oops something went wrong" });
});

app.listen(port, () => console.log("running on port " + port));
