/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.dropTableIfExists('users')
        .createTable('users', function(table) {
            table.bigIncrements().primary();
            table.string('email', 255).notNullable().unique();
            table.string('password', 255).notNullable();
            table.timestamp('created_at', {useTz: false}).defaultTo(knex.fn.now());
            table.timestamp('updated_at', {useTz: false}).defaultTo(knex.fn.now());
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw('DROP TABLE users');
};
