/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.dropTableIfExists('time_capsules')
        .createTable('time_capsules', function(table) {
            table.bigIncrements().primary();
            table.string('subject', 255).notNullable();
            table.text('slug').notNullable().unique();
            table.text('message').notNullable();
            table.datetime('release_time', {useTz: false}).notNullable();
            table.timestamp('created_at', {useTz: false}).defaultTo(knex.fn.now());
            table.timestamp('updated_at', {useTz: false}).defaultTo(knex.fn.now());
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw('DROP TABLE time_capsules');
};
