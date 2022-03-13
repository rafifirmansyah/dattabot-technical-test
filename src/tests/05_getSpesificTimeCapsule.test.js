import app from '../app.js';
import supertest from 'supertest';

const request = supertest(app);

describe('Get List All Time Capsule', () => {
    let token = '';

    test('Reject if the user is not logged in', async () => {
        const response = await Promise.resolve(request
            .get('/time-capsules/prasasti-lobu-tua-barus-f290d9')
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(401);
        expect(response.body.status).toBe('Unauthorized');
        expect(response.body.message).toBe('Please login for access this resources.');
    });

    test('Check if time capsule is not exists', async () => {
        const userData = {
            email: 'propertypurpose@snakebutt.com',
            password: 'helloworld'
        };

        const responseLogin = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        token = responseLogin.body.data.token;

        const responseSpecificTimeCapsule = await Promise.resolve(request
            .get('/time-capsules/hello-world-fad23a')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(responseSpecificTimeCapsule.status).toBe(404);
        expect(responseSpecificTimeCapsule.body.status).toBe('Not Found');
        expect(responseSpecificTimeCapsule.body.message).toBe('Time capsule is not found.');
    });

    test('Check if time capsule hasn\'t been released yet', async () => {
        const responseSpecificTimeCapsule = await Promise.resolve(request
            .get('/time-capsules/prasasti-pasir-awi-5faeca')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(responseSpecificTimeCapsule.status).toBe(423);
        expect(responseSpecificTimeCapsule.body.status).toBe('Locked');
        expect(responseSpecificTimeCapsule.body.message).toBe('Unable to display the time capsule, because it hasn\'t been released yet.');
    });

    test('Get the specific active time capsule', async () => {
        const responseSpecificTimeCapsule = await Promise.resolve(request
            .get('/time-capsules/prasasti-lobu-tua-barus-e2a0b7')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(responseSpecificTimeCapsule.status).toBe(200);
        expect(responseSpecificTimeCapsule.body.status).toBe('Success');
        expect(responseSpecificTimeCapsule.body.data).toBeTruthy();
    });
});