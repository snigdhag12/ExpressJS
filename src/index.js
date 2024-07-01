import express, { request, response } from 'express';
import routes from './routes/index.js'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.js';

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
    }
}));

//Shifting routers to barrel and using single router import
// app.use(usersRouter); 
// app.use(productssRouter);
app.use(routes);

// const loggingMiddleWare = (request, response, next) => {
//     console.log(`${request.method} - ${request.url}`);
//     next();
// };

// app.use(loggingMiddleWare); -> register globally



const PORT = process.env.PORT || 3000; //pick port from environment variables else if not defined go with default




//starts server at specific port
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

//get API routes examples
//app.get("/", loggingMiddleWare, (request, response) -> invoking middlewares
app.get("/", 
(request, response, next) => {
    console.log("Processing 1");
    next();
},
(request, response, next) => {
    console.log("Processing 2");
    next();
},
(request, response) => {
    console.log(request.session);
    console.log(request.session.id);

    //to remove the multiple session generation
    request.session.visited = true;

    response.cookie("hello", "world", {maxAge: 60000});
    response.status(200).send({msg: "hello world"});
});

//shifting all API calls for user to routes file
// app.get("/api/users", query('filter').isString().isLength({min: 3, max: 10}).withMessage('Character length invalid'), (request, response) => {
//     const result = validationResult(request);
//     const {
//         query: {filter, value}
//     } = request;

//     if(!filter || !value){
//         return response.send(mockUsers);
//     }
//     const userKeys = Object.keys(mockUsers[0]);
//     if (!userKeys.includes(filter)) {
//         return response.status(404).send('Invalid filter parameter passed.');
//     }
//     response.send(
//         mockUsers.filter(
//             (user) => user[filter].includes(value)));
    
// });

// app.get("/api/products", (request, response) => {
//     response.send([
//         {id: 1, name: "demo1", price: 12.90},
//         {id: 2, name: "demo2", price: 1.99},
//         {id: 3, name: "demo3", price: 0.9},
//     ]);
// });

app.post('/api/auth', (request, response) => {
    const { body: {username, password} } = request;
    const findUser = mockUsers.find((user) => user.username == username);
    if(!findUser || findUser.password !== password) return response.status(401).send({ msg: "bad credentials"});

    request.session.user = findUser;
    return response.status(200).send(findUser);
})

app.get('/api/auth/status', (request,response) => {
    return request.session.user? response.status(200).send(request.session.user) : response.status(401).send({msg: "Not Authenticated"});
});

app.post('/api/cart', (request, response) => {
    if(!request.session.user) return response.sendStatus(401);
    const { body: item} = request;

    const { cart } = request.session;

    if(cart) {
        cart.push(item);
    }else {
        request.session.cart = [item];
    }
    return response.status(201).send(item);
});

app.get('/api/cart', (request, response) => {
    if(!request.session.user) return response.sendStatus(401);
    
    return response.send(request.session.cart?? []);
});