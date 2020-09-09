exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_contacts")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_contacts").insert([
        { user_id: 1, contact_id: 2, chat_id: 1 },
        { user_id: 2, contact_id: 1, chat_id: 1 },
        { user_id: 1, contact_id: 3, chat_id: 2 },
        { user_id: 3, contact_id: 1, chat_id: 2 },
        { user_id: 5, contact_id: 4, chat_id: 3 },
        { user_id: 4, contact_id: 5, chat_id: 3 },
      ]);
    });
};
