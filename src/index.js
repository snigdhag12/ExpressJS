import express from 'express';
import routes from './routes/index.js'

const app = express();

//registering the middleware to handle parse json 
app.use(express.json());


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

