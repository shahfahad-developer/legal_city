exports.up = function(knex) {
  return knex.schema.alterTable('lawyers', function(table) {
    table.text('bio');
    table.integer('experience_years');
    table.string('phone');
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('zip_code');
    table.decimal('hourly_rate', 8, 2);
    table.string('profile_image');
    table.boolean('is_verified').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('lawyers', function(table) {
    table.dropColumn('bio');
    table.dropColumn('experience_years');
    table.dropColumn('phone');
    table.dropColumn('address');
    table.dropColumn('city');
    table.dropColumn('state');
    table.dropColumn('zip_code');
    table.dropColumn('hourly_rate');
    table.dropColumn('profile_image');
    table.dropColumn('is_verified');
  });
};