import routes from './routes/index.js'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import express from 'express';
import mongoose from 'mongoose';
import './strategies/local-strategy.js';


export function createApp() {
    const app = express();
        //registering the middleware to handle parse json 
    app.use(express.json());

    app.use(cookieParser());

    app.use(session({
        secret: 'simple cookie',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient()
        }),
    }));


    app.use(passport.initialize());
    app.use(passport.session());

    //Shifting routers to barrel and using single router import
    // app.use(usersRouter); 
    // app.use(productssRouter);
    app.use(routes);

    app.post('/api/auth', passport.authenticate('local'), (request, response) => {
        response.sendStatus(200);
    });

    app.get('/api/auth/status', (request, response) => {
        console.log(request.user);
        return request.user ? response.send(request.user) : response.sendStatus(401);
    });

    app.post('/api/auth/logout', (request, response) => {
        if(!request.user) return response.sendStatus(401);

        request.logout((err) => {
            if(err) return response.sendStatus(400);
            response.send(200);
        })
    })
    return app;
}