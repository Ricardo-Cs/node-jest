import request from 'supertest';
import app from '../app';
import { response } from 'express';
import { User } from '../models/User';

describe('Testing api routes', () => {

    beforeAll(async () => {
        await User.sync({ force: true });
    });

    let email = 'test@jest.com';
    let password = '1234';

    it("Should return 'pong'", (done) => {
        request(app)
            .get('/ping')
            .then(response => {
                expect(response.body.pong).toBeTruthy();
                return done();
            });
    });

    it("Should register a new user", (done) => {
        request(app)
            .post('/register')
            .send(`email=${email}&password=${password}`)
            .then(response => {
                expect(response.body.error).toBeUndefined();
                expect(response.body).toHaveProperty('id');
                return done();
            });
    });

    it("Should not allow to register with existing email", (done) => {
        request(app)
            .post('/register')
            .send(`email=${email}&password=${password}`)
            .then(response => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Should not allow to register without email", (done) => {
        request(app)
            .post('/register')
            .send(`password=${password}`)
            .then(response => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Should not allow to register without password", (done) => {
        request(app)
            .post('/register')
            .send(`email=${email}`)
            .then(response => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Should not allow to register without any data", (done) => {
        request(app)
            .post('/register')
            .send(``)
            .then(response => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Should login correctly", (done) => {
        request(app)
            .post('/login')
            .send(`email=${email}&password=${password}`)
            .then(response => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.status).toBeTruthy();
                return done();
            });
    });

    it("Should not login with incorrect data", (done) => {
        request(app)
            .post('/login')
            .send(`email=${email}&password=invalidPassword`)
            .then(response => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.status).toBeFalsy();
                return done();
            });
    });

    it("Should list users", (done) => {
        request(app)
            .get('/list')
            .then(response => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.list.length).toBeGreaterThanOrEqual(1);
                expect(response.body.list).toContain(email);
                return done();
            });
    });
});