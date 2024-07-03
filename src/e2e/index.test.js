import request from "supertest";
import express from 'express';
import mongoose from 'mongoose';
import { createApp } from '../createApp.js'

//DEMO E2E test
// const app = express();

// app.get('/hello', (req, res) => res.sendStatus(200));

// describe('hello endpoint', () => {
//     it('get /hello and expect 200', async () => {
//         // request(app).get('/hello').expect(200);
//         const result = await request(app).get('/hello');
//         expect(result.statusCode).toBe(200);
//     })
// })




describe('/api/auth', () => {
    let app;
        beforeAll(() => {
            mongoose.connect('mongodb://localhost/express_course_test')
            .then(() => console.log("connected to testdb"))
            .catch((err) => console.log(`Error: ${err}`));

        app = createApp(); 
    });

    it("should return 401 when not logged in", async () => {
        const result = await request(app).get('/api/auth/status');
        expect(result.statusCode).toBe(401);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("Disconnected from testdb");
      });
});

