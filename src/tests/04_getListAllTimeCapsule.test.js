import app from '../app.js';
import supertest from 'supertest';

const request = supertest(app);

describe('Get List All Time Capsule', () => {
    let token = '';

    test('Reject if the user is not logged in', async () => {
        const response = await Promise.resolve(request
            .get('/time-capsules')
            .query({
                page: 1,
                size: 10,
                sort: 'DESC'
            })
            .set('Accept', 'application/json')
        );

        expect(response.status).toBe(401);
        expect(response.body.status).toBe('Unauthorized');
        expect(response.body.message).toBe('Please login for access this resources.');
    });

    test('Request without query string', async() => {
        const userData = {
            email: 'propertypurpose@snakebutt.com',
            password: 'helloworld'
        };

        const responseLogin = await Promise.resolve(request.post('/login').send(userData).set('Accept', 'application/json'));

        token = responseLogin.body.data.token;

        const responseTimeCapsule = await Promise.resolve(request
            .get('/time-capsules')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(responseTimeCapsule.status).toBe(200);
        expect(responseTimeCapsule.body.status).toBe('Success');
        expect(responseTimeCapsule.body.data).toBeTruthy();
        expect(responseTimeCapsule.body.information).toBeTruthy();
    });

    test('Request with query string', async() => {
        const responseTimeCapsule = await Promise.resolve(request
            .get('/time-capsules')
            .query({
                page: 1,
                size: 10,
                sort: 'DESC'
            })
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(responseTimeCapsule.status).toBe(200);
        expect(responseTimeCapsule.body.status).toBe('Success');
        expect(responseTimeCapsule.body.data).toBeTruthy();
        expect(responseTimeCapsule.body.information).toBeTruthy();
    });

    test('Request with query string and filter release status', async() => {
        const responseTimeCapsule = await Promise.resolve(request
            .get('/time-capsules')
            .query({
                page: 1,
                size: 10,
                sort: 'DESC',
                status: 'inactive'
            })
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
        );

        expect(responseTimeCapsule.status).toBe(200);
        expect(responseTimeCapsule.body.status).toBe('Success');
        expect(responseTimeCapsule.body.data).toBeTruthy();
        expect(responseTimeCapsule.body.information).toBeTruthy();
    });
});
