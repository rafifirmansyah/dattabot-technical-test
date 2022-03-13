import app from '../app.js';
import supertest from 'supertest';
import fileSystem from 'fs';
import helper from '../helper.js';

const request = supertest(app);

describe('Create Time Capsule', () => {
    let token = '';

    test('Reject if the user is not logged in', async () => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'Prasasti Singhasari 1351')
            .field('message', 'Prasasti Singhasari juga dikenal sebagai Prasasti Gajah Mada, adalah sebuah prasasti bertarikh tahun 1351 M, yang ditemukan di Singosari, Kabupaten Malang, Jawa Timur dan sekarang disimpan di Museum Gajah. Ditulis dengan Aksara Jawa. Prasasti ini ditulis untuk mengenang pembangunan sebuah caitya atau sebuah bangunan/monumen untuk penghormatan para brahmana dan raja Krtanagara yang telah gugur saat terjadinya pemberontakan Jayakatwang di kerajaan Singhasari. Prasasti Gajah Mada dilaksanakan oleh Mahapatih Gajah Mada disebut juga sebagai mapatih jirṇnodhara. Paruh pertama prasasti ini merupakan pentarikhan tanggal yang sangat terperinci, termasuk pemaparan letak benda-benda angkasa. Paruh kedua mengemukakan maksud prasasti ini, yaitu sebagai pariwara pembangunan sebuah caitya.')
            .field('release_time', 1647495129000)
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/prasasti-gajah-mada-malang-rev4.jpeg`))
            .type('multipart/form-data')
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(401);
        expect(response.body.status).toBe('Unauthorized');
        expect(response.body.message).toBe('Please login for access this resources.');
    });

    test("Check If there is no request", async() => {
        const userData = {
            email: 'propertypurpose@snakebutt.com',
            password: 'helloworld'
        };

        const responseLogin = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        token = responseLogin.body.data.token;

        const responseCreateTimeCapsule = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', '')
            .field('message', '')
            .field('release_time', '')
            .attach('attach_files', '')
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(responseCreateTimeCapsule.status).toBe(422);
        expect(responseCreateTimeCapsule.body.subject.msg).toBe('The subject is required.');
        expect(responseCreateTimeCapsule.body.message.msg).toBe('The message is required.');
        expect(responseCreateTimeCapsule.body.release_time.msg).toBe('The release time is required.');
        expect(responseCreateTimeCapsule.body.attach_files.msg).toBe('The attach files is required.');
    });

    test("Check if only fill in the subject", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'Prasasti Singhasari 1351')
            .field('message', '')
            .field('release_time', '')
            .attach('attach_files', '')
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.message.msg).toBe('The message is required.');
        expect(response.body.release_time.msg).toBe('The release time is required.');
        expect(response.body.attach_files.msg).toBe('The attach files is required.');
    });

    test("Check if only fill in the message", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', '')
            .field('message', 'Prasasti Singhasari juga dikenal sebagai Prasasti Gajah Mada, adalah sebuah prasasti bertarikh tahun 1351 M, yang ditemukan di Singosari, Kabupaten Malang, Jawa Timur dan sekarang disimpan di Museum Gajah. Ditulis dengan Aksara Jawa. Prasasti ini ditulis untuk mengenang pembangunan sebuah caitya atau sebuah bangunan/monumen untuk penghormatan para brahmana dan raja Krtanagara yang telah gugur saat terjadinya pemberontakan Jayakatwang di kerajaan Singhasari. Prasasti Gajah Mada dilaksanakan oleh Mahapatih Gajah Mada disebut juga sebagai mapatih jirṇnodhara. Paruh pertama prasasti ini merupakan pentarikhan tanggal yang sangat terperinci, termasuk pemaparan letak benda-benda angkasa. Paruh kedua mengemukakan maksud prasasti ini, yaitu sebagai pariwara pembangunan sebuah caitya.')
            .field('release_time', '')
            .attach('attach_files', '')
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.subject.msg).toBe('The subject is required.');
        expect(response.body.release_time.msg).toBe('The release time is required.');
        expect(response.body.attach_files.msg).toBe('The attach files is required.');
    });

    test("Check if only fill in the release time", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', '')
            .field('message', '')
            .field('release_time', 1647495129000)
            .attach('attach_files', '')
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.subject.msg).toBe('The subject is required.');
        expect(response.body.message.msg).toBe('The message is required.');
        expect(response.body.attach_files.msg).toBe('The attach files is required.');
    });

    test("Check if only fill in the attach files", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', '')
            .field('message', '')
            .field('release_time', '')
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/prasasti-gajah-mada-malang-rev4.jpeg`))
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.subject.msg).toBe('The subject is required.');
        expect(response.body.message.msg).toBe('The message is required.');
        expect(response.body.release_time.msg).toBe('The release time is required.');
    });

    test("Check if the fill in subject is less than 3 character", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'ab')
            .field('message', 'Prasasti Singhasari juga dikenal sebagai Prasasti Gajah Mada, adalah sebuah prasasti bertarikh tahun 1351 M, yang ditemukan di Singosari, Kabupaten Malang, Jawa Timur dan sekarang disimpan di Museum Gajah. Ditulis dengan Aksara Jawa. Prasasti ini ditulis untuk mengenang pembangunan sebuah caitya atau sebuah bangunan/monumen untuk penghormatan para brahmana dan raja Krtanagara yang telah gugur saat terjadinya pemberontakan Jayakatwang di kerajaan Singhasari. Prasasti Gajah Mada dilaksanakan oleh Mahapatih Gajah Mada disebut juga sebagai mapatih jirṇnodhara. Paruh pertama prasasti ini merupakan pentarikhan tanggal yang sangat terperinci, termasuk pemaparan letak benda-benda angkasa. Paruh kedua mengemukakan maksud prasasti ini, yaitu sebagai pariwara pembangunan sebuah caitya.')
            .field('release_time', 1647495129000)
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/prasasti-gajah-mada-malang-rev4.jpeg`))
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.subject.msg).toBe('The subject must be at least 3 character.');
    });

    test("Check if the fill in subject is greater than 255 character", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in')
            .field('message', 'Prasasti Singhasari juga dikenal sebagai Prasasti Gajah Mada, adalah sebuah prasasti bertarikh tahun 1351 M, yang ditemukan di Singosari, Kabupaten Malang, Jawa Timur dan sekarang disimpan di Museum Gajah. Ditulis dengan Aksara Jawa. Prasasti ini ditulis untuk mengenang pembangunan sebuah caitya atau sebuah bangunan/monumen untuk penghormatan para brahmana dan raja Krtanagara yang telah gugur saat terjadinya pemberontakan Jayakatwang di kerajaan Singhasari. Prasasti Gajah Mada dilaksanakan oleh Mahapatih Gajah Mada disebut juga sebagai mapatih jirṇnodhara. Paruh pertama prasasti ini merupakan pentarikhan tanggal yang sangat terperinci, termasuk pemaparan letak benda-benda angkasa. Paruh kedua mengemukakan maksud prasasti ini, yaitu sebagai pariwara pembangunan sebuah caitya.')
            .field('release_time', 1647495129000)
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/prasasti-gajah-mada-malang-rev4.jpeg`))
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.subject.msg).toBe('The subject must be a maximum of 255 character.');
    });

    test("Check if the fill in message is less than 3 character", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'Prasasti Singhasari 1351')
            .field('message', 'ab')
            .field('release_time', 1647495129000)
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/prasasti-gajah-mada-malang-rev4.jpeg`))
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.message.msg).toBe('The message must be at least 3 character.');
    });

    test("Check if the fill in an invalid release time", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'Prasasti Singhasari 1351')
            .field('message', 'Prasasti Singhasari juga dikenal sebagai Prasasti Gajah Mada, adalah sebuah prasasti bertarikh tahun 1351 M, yang ditemukan di Singosari, Kabupaten Malang, Jawa Timur dan sekarang disimpan di Museum Gajah. Ditulis dengan Aksara Jawa. Prasasti ini ditulis untuk mengenang pembangunan sebuah caitya atau sebuah bangunan/monumen untuk penghormatan para brahmana dan raja Krtanagara yang telah gugur saat terjadinya pemberontakan Jayakatwang di kerajaan Singhasari. Prasasti Gajah Mada dilaksanakan oleh Mahapatih Gajah Mada disebut juga sebagai mapatih jirṇnodhara. Paruh pertama prasasti ini merupakan pentarikhan tanggal yang sangat terperinci, termasuk pemaparan letak benda-benda angkasa. Paruh kedua mengemukakan maksud prasasti ini, yaitu sebagai pariwara pembangunan sebuah caitya.')
            .field('release_time', 'abcd')
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/prasasti-gajah-mada-malang-rev4.jpeg`))
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.release_time.msg).toBe('Release time format must be Unix Epoch Timestamp in milliseconds. example : 1646975847000.');
    });

    test("Check if the fill in release time is less than or equal time now", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'Prasasti Singhasari 1351')
            .field('message', 'Prasasti Singhasari juga dikenal sebagai Prasasti Gajah Mada, adalah sebuah prasasti bertarikh tahun 1351 M, yang ditemukan di Singosari, Kabupaten Malang, Jawa Timur dan sekarang disimpan di Museum Gajah. Ditulis dengan Aksara Jawa. Prasasti ini ditulis untuk mengenang pembangunan sebuah caitya atau sebuah bangunan/monumen untuk penghormatan para brahmana dan raja Krtanagara yang telah gugur saat terjadinya pemberontakan Jayakatwang di kerajaan Singhasari. Prasasti Gajah Mada dilaksanakan oleh Mahapatih Gajah Mada disebut juga sebagai mapatih jirṇnodhara. Paruh pertama prasasti ini merupakan pentarikhan tanggal yang sangat terperinci, termasuk pemaparan letak benda-benda angkasa. Paruh kedua mengemukakan maksud prasasti ini, yaitu sebagai pariwara pembangunan sebuah caitya.')
            .field('release_time', 1646890329000)
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/prasasti-gajah-mada-malang-rev4.jpeg`))
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.release_time.msg).toBe('Release time must be greater than time now.');
    });

    test("Check if the fill in an invalid attach files format", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'Prasasti Singhasari 1351')
            .field('message', 'Prasasti Singhasari juga dikenal sebagai Prasasti Gajah Mada, adalah sebuah prasasti bertarikh tahun 1351 M, yang ditemukan di Singosari, Kabupaten Malang, Jawa Timur dan sekarang disimpan di Museum Gajah. Ditulis dengan Aksara Jawa. Prasasti ini ditulis untuk mengenang pembangunan sebuah caitya atau sebuah bangunan/monumen untuk penghormatan para brahmana dan raja Krtanagara yang telah gugur saat terjadinya pemberontakan Jayakatwang di kerajaan Singhasari. Prasasti Gajah Mada dilaksanakan oleh Mahapatih Gajah Mada disebut juga sebagai mapatih jirṇnodhara. Paruh pertama prasasti ini merupakan pentarikhan tanggal yang sangat terperinci, termasuk pemaparan letak benda-benda angkasa. Paruh kedua mengemukakan maksud prasasti ini, yaitu sebagai pariwara pembangunan sebuah caitya.')
            .field('release_time', 1647406051000)
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/overview.gif`))
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.attach_files.msg).toBe('Attach files format must be .jpg, .jpeg, .png. or .pdf.');
    });

    test("Create Time Capsule with complete data", async() => {
        const response = await Promise.resolve(request
            .post('/time-capsules')
            .field('subject', 'Prasasti Singhasari 1351')
            .field('message', 'Prasasti Singhasari juga dikenal sebagai Prasasti Gajah Mada, adalah sebuah prasasti bertarikh tahun 1351 M, yang ditemukan di Singosari, Kabupaten Malang, Jawa Timur dan sekarang disimpan di Museum Gajah. Ditulis dengan Aksara Jawa. Prasasti ini ditulis untuk mengenang pembangunan sebuah caitya atau sebuah bangunan/monumen untuk penghormatan para brahmana dan raja Krtanagara yang telah gugur saat terjadinya pemberontakan Jayakatwang di kerajaan Singhasari. Prasasti Gajah Mada dilaksanakan oleh Mahapatih Gajah Mada disebut juga sebagai mapatih jirṇnodhara. Paruh pertama prasasti ini merupakan pentarikhan tanggal yang sangat terperinci, termasuk pemaparan letak benda-benda angkasa. Paruh kedua mengemukakan maksud prasasti ini, yaitu sebagai pariwara pembangunan sebuah caitya.')
            .field('release_time', 1647495129000)
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/Prasasti_Gajah_Mada.jpeg`))
            .attach('attach_files', fileSystem.createReadStream(`${helper.pathUploads}/dummy-time-capsules-file/prasasti-gajah-mada-malang-rev4.jpeg`))
            .type('multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe('Time capsule successfully created.');
    });
});