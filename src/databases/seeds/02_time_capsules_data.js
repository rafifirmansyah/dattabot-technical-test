/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('time_capsules').del()
    .then(function () {
      // Inserts seed entries
      return knex('time_capsules').insert([
        {subject: 'Prasasti Lobu Tua (Barus)', slug: 'prasasti-lobu-tua-barus-e2a0b7', message: 'Prasasti Lobu Tua atau juga dikenal sebagai Prasasti Barus berangka tahun 1088 M ditulis menggunakan aksara Tamil dan Grantha. Prasasti berbahasa Tamil ini berisi mengenai penarikan pajak dan keberadaan perkumpulan pedagang asing yang bermukim di Barus. Prasasti Lobu Tua memberikan informasi mengenai nama lama Barus yang disebut sebagai Vārōcu.', release_time: '2022-03-13 21:29:09'},
        {subject: 'Prasasti Ciaruteun', slug: 'prasasti-ciaruteun-69f28a', message: 'Pada tahun 1863 di Hindia Belanda, sebuah batu besar dengan ukiran aksara purba dilaporkan ditemukan di dekat Tjampea (Ciampea), tak jauh dari Buitenzorg (kini Bogor). Batu berukir tersebut ditemukan di Kampung Muara, di aliran Ci Aruteun, salah satu anak sungai Cisadane.[1]:15 Segera pada tahun yang sama, prasasti Ciaruteun dilaporkan oleh pemimpin Bataviasche Genootschap van Kunsten en Wetenschappen (sekarang Museum Nasional) di Batavia. Akibat banjir besar pada tahun 1893 batu prasasti ini terhanyutkan beberapa meter ke hilir dan bagian batu yang bertulisan menjadi terbalik posisinya ke bawah. Kemudian pada tahun 1903 prasasti ini dipindahkan ke tempat semula.', release_time: '2022-03-13 21:32:09'},
        {subject: 'Prasasti Pasir Awi', slug: 'prasasti-pasir-awi-5faeca', message: 'Prasasti Pasir Awi adalah salah satu dari tujuh prasasti peninggalan kerajaan tertua di barat Pulau Jawa. Prasasti ini telah ditetapkan menjadi Benda Cagar Budaya peringkat nasional. Berbeda dengan keenam prasasti lainnya yang hampir seluruhnya berada di dekat aliran sungai, lokasi prasasti ini justru berada di perbukitan. Tepatnya di sebelah selatan bukit Pasir Awi (± 559 mdpl) di kawasan hutan di perbukitan Cipamingkis Kabupaten Bogor. Untuk bisa sampai ke lokasi prasasti, kita dapat melalui Jalan Sukaraja Dayeuh. Kemudian masuk ke jalan berbatuan dengan medan yang cukup menyulitkan kendaraan yang melaluinya. Selesai jalan berbatuan dilalui, selanjutnya dihadapkan dengan undakan anak tangga yang cukup curam. Setelah menaiki tangga itu, akhirnya sampailah di lokasi insitu tempat Prasasti Pasir Awi. Sejarah prasasti ini tidaklah banyak diungkap. Hanya saja keberadaannya sudah diketahui sejak 1864. Ditemukan kali pertama oleh seorang arkeolog asal Belanda, bernama N.W. Hoepermans. S. Pada prasasti ini terdapat pahatan sepasang tapak kaki yang menghadap ke arah utara dan timur. Pahatan serupa juga ditemukan di Prasasti Ciaruteun dan Prasasti Pasir Jambu yang terletak di Kecamatan Cibungbulan dan Kecamatan Nanggung, Kabupaten Bogor. Pahatan tapak kaki tersebut dianggap sebagai tapak kaki milik Sri Purnawarman raja dari Kerajaan Taruma atau Tarumanegara. Kerajaan ini pernah berjaya pada abad ke-4 hingga abad ke-7 Masehi.', release_time: '2022-03-16 12:32:09'}
      ]);
    });
};
