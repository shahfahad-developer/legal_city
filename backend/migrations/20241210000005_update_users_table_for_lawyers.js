exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('zip_code');
    table.string('country');
    table.string('mobile_number');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropColumn('address');
    table.dropColumn('city');
    table.dropColumn('state');
    table.dropColumn('zip_code');
    table.dropColumn('country');
    table.dropColumn('mobile_number');
  });
};