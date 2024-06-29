import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000; //pick port from environment variables else if not defined go with default

//starts server at specific port
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})