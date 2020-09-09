exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_messages")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_messages").insert([
        { content: "hello", author_id: 1, chat_id: 1 },
        { content: "what's up", author_id: 2, chat_id: 1 },
        { content: "im tired", author_id: 1, chat_id: 2 },
        { content: "what is your favorite color", author_id: 3, chat_id: 2 },
        { content: "did u buy the milk", author_id: 4, chat_id: 3 },
        { content: "okay i did.", author_id: 5, chat_id: 3 },
      ]);
    });
};
