exports.up = async (knex) => {
  /** TABLES */
  await knex.schema
    .createTable("user_accounts", (table) => {
      table.increments("user_id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("country");
      table.string("gender");
      table.string("avatar_url").defaultTo("default.png");
      table.string("date_of_birth").defaultTo(null);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.unique("email");
    })
    .createTable("user_contacts", (table) => {
      table.integer("user_id").notNullable();
      table.integer("contact_id").notNullable();
      table.integer("chat_id").notNullable();
      table.boolean("chat_status").defaultTo(false);
    })
    .createTable("user_messages", (table) => {
      table.increments("id");
      table.string("content");
      table.integer("author_id");
      table.integer("chat_id");
      table.integer("likes").defaultTo(0);
      table.string("reactions").defaultTo(null);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });

  /** VIEWS */
  await knex.raw(`
    create view user_profiles as 
    select user_id,name,country,gender,avatar_url 
    from user_accounts;
  `);

  await knex.raw(`
    create view user_contact_cards as
    select C.*, 
    P.name as contact_name, 
    P.gender as contact_gender, 
    P.country as contact_country,
    P.avatar_url as contact_avatar_url
    from user_contacts as C 
    inner join user_profiles as P 
    on C.contact_id = P.user_id;
  `);

  await knex.raw(`
    create view user_message_cards as
    select M.*,
    P.name as author_name,
    P.avatar_url as author_avatar_url
    from user_messages as M 
    inner join user_profiles as P
    on M.author_id = P.user_id;
    `);
};

exports.down = async function (knex) {
  await knex.schema
    .dropTableIfExists("user_accounts")
    .dropTableIfExists("user_contacts")
    .dropTableIfExists("user_messages");
  await knex.raw("drop view if exists user_profiles");
  await knex.raw("drop view if exists user_contact_cards");
  await knex.raw("drop view if exists user_message_cards");
};
