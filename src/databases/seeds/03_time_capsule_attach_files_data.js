/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('time_capsule_attach_files').del()
    .then(function () {
      // Inserts seed entries
      return knex('time_capsule_attach_files').insert([
        {time_capsule_id: 1, file_path: 'time-capsules-file/prasasti-lobu-tua-barus-e2a0b7/305281c5444db5eebf86cb44187abe47.jpeg'},
        {time_capsule_id: 1, file_path: 'time-capsules-file/prasasti-lobu-tua-barus-e2a0b7/12dfb4f896ff4f22a65b1f6ba469bb65.jpeg'},
        {time_capsule_id: 2, file_path: 'time-capsules-file/prasasti-ciaruteun-69f28a/5118bda10eec8fccde136fa62407cda6.jpeg'},
        {time_capsule_id: 2, file_path: 'time-capsules-file/prasasti-ciaruteun-69f28a/32ec0b1d3d118ad4fa836cd8173a027f.jpeg'},
        {time_capsule_id: 3, file_path: 'time-capsules-file/prasasti-pasir-awi-5faeca/cbe07559653b64b5067658617232bc7d.jpeg'},
        {time_capsule_id: 3, file_path: 'time-capsules-file/prasasti-pasir-awi-5faeca/ff5f3adc221d7cc7e9f7bf259a57602a.jpeg'},
        {time_capsule_id: 3, file_path: 'time-capsules-file/prasasti-pasir-awi-5faeca/eaf0d46215509c5f9f76028ba8844f5a.jpeg'},
      ]);
    });
};
