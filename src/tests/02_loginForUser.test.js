import app from '../app.js';
import supertest from 'supertest';

const request = supertest(app);

describe('Login for user', () => {
    test("Check if not fill in email and password", async() => {
        const userData = {
            email: '',
            password: ''
        };

        const response = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.email.msg).toBe('The email is required.');
        expect(response.body.password.msg).toBe('The password is required.');
    });
    
    test("Check if only fill in the email", async() => {
        const userData = {
            email: 'propertypurpose@snakebutt.com',
            password: ''
        };

        const response = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.password.msg).toBe('The password is required.');
    });

    test("Check if only fill in the password", async() => {
        const userData = {
            email: '',
            password: 'helloworld'
        };

        const response = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.email.msg).toBe('The email is required.');
    });

    test("Check if fill in an invalid email", async() => {
        const userData = {
            email: 'hellow',
            password: 'helloworld'
        };

        const response = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.email.msg).toBe('Please enter a valid email, example: user@example.com.');
    });

    test("Check if email is not registered", async() => {
        const userData = {
            email: 'helloworld@example.com',
            password: 'helloworld'
        };

        const response = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.email.msg).toBe('Your email is not registered, please register first.');
    });

    test("Check if password is wrong", async() => {
        const userData = {
            email: 'propertypurpose@snakebutt.com',
            password: 'helloworld123'
        };

        const response = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        expect(response.status).toBe(422);
        expect(response.body.password.msg).toBe('Your password is wrong, please check your password again.');
    });

    test('Login with complete data', async() => {
        const userData = {
            email: 'propertypurpose@snakebutt.com',
            password: 'helloworld'
        };

        const response = await Promise.resolve(request
            .post('/login')
            .send(userData)
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Success');
        expect(response.body.message).toBe('Login successfully.');
        expect(response.body.data.token).toBeTruthy();
    });
});