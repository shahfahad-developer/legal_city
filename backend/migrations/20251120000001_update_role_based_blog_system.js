exports.up = function(knex) {
  return knex.schema
    .alterTable('users', function(table) {
      // Update role column to proper ENUM
      table.enu('role', ['user', 'lawyer', 'admin']).defaultTo('user').alter();
    })
    .alterTable('blogs', function(table) {
      // Update status column to include pending and rejected
      table.enu('status', ['draft', 'pending', 'published', 'rejected']).defaultTo('draft').alter();
    })
    .then(() => {
      // Set user 1 as admin and update existing blogs
      return knex('users').where('id', 1).update({ role: 'admin' });
    })
    .then(() => {
      return knex('blogs').update({ author_id: 1, status: 'published' });
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('users', function(table) {
      table.string('role').defaultTo('user').alter();
    })
    .alterTable('blogs', function(table) {
      table.enu('status', ['draft', 'published']).defaultTo('draft').alter();
    });
};