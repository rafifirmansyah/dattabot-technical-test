const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {email: 'propertypurpose@snakebutt.com', password: bcrypt.hashSync('helloworld', 10)},
        {email: 'darthmar@emvil.com', password: bcrypt.hashSync('helloworld', 10)},
      ]);
    });
};
