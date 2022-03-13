import app from '../app.js';
import supertest from 'supertest';

const request = supertest(app);

describe('Self-register for user', () => {
    test("Check if not fill in email and password", async() => {
        const userData = {
            email: '',
            password: ''
        };

        const response = await Promise.resolve(request.post('/register').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.email.msg).toBe('The email is required.');
        expect(response.body.password.msg).toBe('The password is required.');
    });
    
    test("Check if only fill in the email", async() => {
        const userData = {
            email: 'tivik@telemol.fun',
            password: ''
        };

        const response = await Promise.resolve(request.post('/register').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.password.msg).toBe('The password is required.');
    });
    
    test("Check if only fill in the password", async() => {
        const userData = {
            email: '',
            password: 'helloworld'
        };

        const response = await Promise.resolve(request.post('/register').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.email.msg).toBe('The email is required.');
    });

    test("Check if fill in an invalid email", async() => {
        const userData = {
            email: 'hellow',
            password: 'helloworld'
        };

        const response = await Promise.resolve(request.post('/register').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.email.msg).toBe('Please enter a valid email, example: user@example.com.');
    });

    test("Check if fill in the password is less than 6 character", async() => {
        const userData = {
            email: 'tivik@telemol.fun', 
            password: 'haii' // Contain 4 Character
        };

        const response = await Promise.resolve(request.post('/register').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.password.msg).toBe('The password must be at least 6 character.');
    });

    test("Check if fill in the password is more than 255 character", async() => {
        const userData = {
            email: 'tivik@telemol.fun', 
            password: 'loremipsumdolorsitametconsecteturadipiscingelitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliquaUtenimadminimveniamquisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequatuisauteiruredolorinreprehenderitinvoluptatevelitessecillumdoaasda' // Contain 256 Character
        };

        const response = await Promise.resolve(request.post('/register').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.password.msg).toBe('The password must be a maximum of 255 character.');
    });

    test('Check if register with existing email', async() => {
        const userData = {
            email: 'propertypurpose@snakebutt.com',
            password: 'helloworld'
        };

        const response = await Promise.resolve(request
            .post('/register')
            .send(userData)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(422);
        expect(response.body.email.msg).toBe('This email is already registered, please enter another email.');
    });

    test('Register with complete data', async() => {
        const userData = {
            email: 'tivik@telemol.fun',
            password: 'helloworld'
        };

        const response = await Promise.resolve(request
            .post('/register')
            .send(userData)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe('User successfully created.');
    });
});
  