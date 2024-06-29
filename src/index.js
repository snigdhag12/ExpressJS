import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000; //pick port from environment variables else if not defined go with default

const mockUsers = [
    {id: 1, username: "demo1", displayName: "DEMO1"},
    {id: 2, username: "demo2", displayName: "DEMO2"},
    {id: 3, username: "demo3", displayName: "DEMO3"},
];

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

