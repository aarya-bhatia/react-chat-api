exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_accounts")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user_accounts").insert([
        {
          name: "Aarya Bhatia",
          email: "aaryabhatia@gmail.com",
          password: "123456",
          country: "India",
          gender: "Male",
        },
        {
          name: "Aditya Bansal",
          email: "adityabansal@gmail.com",
          password: "123456",
          country: "India",
          gender: "Male",
        },
        {
          name: "Animesh Joshi",
          email: "animeshjoshi@gmail.com",
          password: "123456",
          country: "India",
          gender: "Male",
        },
        {
          name: "Alice",
          email: "alice@gmail.com",
          password: "123456",
          country: "Canada",
          gender: "Female",
        },
        {
          name: "Lily",
          email: "lily@gmail.com",
          password: "123456",
          country: "Canada",
          gender: "Female",
        },
      ]);
    });
};
