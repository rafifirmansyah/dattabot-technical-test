/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.dropTableIfExists('time_capsule_attach_files')
        .createTable('time_capsule_attach_files', function(table) {
            table.bigIncrements().primary();
            table.bigInteger('time_capsule_id').references('id').inTable('time_capsules').onDelete('cascade');
            table.text('file_path');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw('DROP TABLE time_capsule_attach_files CASCADE');
};
