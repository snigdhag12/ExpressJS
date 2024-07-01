import express, { request, response } from 'express';

const app = express();

//registering the middleware to handle parse json 
app.use(express.json());

const PORT = process.env.PORT || 3000; //pick port from environment variables else if not defined go with default

const mockUsers = [
    {id: 1, username: "demo1", displayName: "DEMO1"},
    {id: 2, username: "demo2", displayName: "DEMO2"},
    {id: 3, username: "demo3", displayName: "DEMO3"},
];

const validateUser = (body) => {
    const { username, displayName } = body;

    if (!username || typeof username !== 'string' || !displayName || typeof displayName !== 'string') {
        return false;
    }

    return true;
};

//starts server at specific port
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})

//get API routes examples
app.get("/", (request, response) => {
    response.status(200).send({msg: "hello world"});
});

app.get("/api/users", (request, response) => {
    const {
        query: {filter, value}
    } = request;

    if(!filter || !value){
        return response.send(mockUsers);
    }
    const userKeys = Object.keys(mockUsers[0]);
    if (!userKeys.includes(filter)) {
        return response.status(404).send('Invalid filter parameter passed.');
    }
    response.send(
        mockUsers.filter(
            (user) => user[filter].includes(value)));
    
});

//POST REQUEST to create user
app.post('/api/users', (request, response) => {

    if(!validateUser(request.body)) {
        return response.status(400).send({ msg: 'Invalid request body. Username and displayName are required and should be strings.' });
    }

    const newUser = { id: mockUsers[mockUsers.length-1] + 1, ...body};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
})


//route parameters
app.get("/api/users/:id", (request, response) => {
    const parsedId = parseInt(request.params.id);
    if(isNaN(parsedId)){
        return response.status(400).send({msg: 'Bad Request. Invalid ID'});
    }

    const findUser = mockUsers.find((user) => user.id === parsedId)
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

app.get("/api/products", (request, response) => {
    response.send([
        {id: 1, name: "demo1", price: 12.90},
        {id: 2, name: "demo2", price: 1.99},
        {id: 3, name: "demo3", price: 0.9},
    ]);
});

app.put("/api/users/:id", (request, response) => {
    const {
        body,
        params : { id },
    } = request;

    if(!validateUser(request.body)) {
        return response.status(400).send({ msg: 'Invalid request body. Username and displayName are required and should be strings.' });
    }

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex(
        (user) => user.id == parsedId
    )

    if(findUserIndex === -1) return response.sendStatus(404);

    mockUsers[findUserIndex] = { id: parsedId, ...body};
    return response.sendStatus(200);
});

app.patch('/api/users/:id', (request, response) => {
    const {
        body,
        params : { id },
    } = request;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id == parsedId
    )
    if(findUserIndex === -1) return response.sendStatus(404);
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex] , ...body}; //...body this will override the previous value
    return response.sendStatus(200);
});

app.delete("/api/users/:id", (request, response) => {
    const {
        params: {id}
    } = request;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.status(400);
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id == parsedId
    )
    if(findUserIndex === -1) return response.sendStatus(404);
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
});