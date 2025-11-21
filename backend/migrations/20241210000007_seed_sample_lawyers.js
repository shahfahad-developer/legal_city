exports.up = function(knex) {
  return knex('lawyers').insert([
    {
      name: 'John Smith',
      email: 'john.smith@lawfirm.com',
      password: '$2a$10$example', // placeholder hash
      registration_id: 'LAW001',
      law_firm: 'Smith & Associates',
      speciality: 'Criminal Law',
      email_verified: 1,
      bio: 'Experienced criminal defense attorney',
      experience_years: 15,
      phone: '+1234567890',
      hourly_rate: 500.00,
      is_verified: true
    }
  ]);
};

exports.down = function(knex) {
  return knex('lawyers').where('registration_id', 'LAW001').del();
};