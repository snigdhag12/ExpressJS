import request from "supertest";
import express from 'express';
import mongoose from 'mongoose';
import { createApp } from '../createApp.js'

describe('create user and login scenario', () => {
    let app;
        beforeAll(() => {
            mongoose.connect('mongodb://localhost/express_course_test')
            .then(() => console.log("connected to testdb"))
            .catch((err) => console.log(`Error: ${err}`));

        app = createApp(); 
    });

    it('create user', async () => {
        const response = await request(app).post('/api/users').send({
            username: 'testUser',
            password: 'hello123',
            displayName: 'user_display'
        });
        expect(response.status).toBe(201);
    });

    it('log in and check for auth status', async () => {
        const response = await request(app)
        .post('/api/auth')
        .send({
            username: 'testUser',
            password: 'hello123',
        })
        .then((res) => 
        {
            return request(app)
            .get('/api/auth/status')
            .set('Cookie', res.headers["set-cookie"])
    });

        expect(response.statusCode).toBe(200);
    });


    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("Disconnected from testdb");
      });
});

