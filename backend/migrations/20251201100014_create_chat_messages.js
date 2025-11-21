exports.up = function(knex) {
  return knex.schema.createTable('chat_messages', function(table) {
    table.increments('id').primary();
    table.integer('sender_id').unsigned().references('id').inTable('users');
    table.integer('receiver_id').unsigned().references('id').inTable('users');
    table.text('message');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('chat_messages');
};