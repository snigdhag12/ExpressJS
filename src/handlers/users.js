import { mockUsers } from "../utils/constants.js";
import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/helpers.js";
import { User } from "../mongoose/schemas/user.js";

export const getUserByIdHandler = (request, response) => {
    const parsedId = parseInt(request.params.id);
    if(isNaN(parsedId)){
        return response.status(400).send({msg: 'Bad Request. Invalid ID'});
    }

    const findUser = mockUsers.find((user) => user.id === parsedId)
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);
};

export const createUserHandler = async (request, response) => {

    // if(!validateUser(request.body)) {
    //     return response.status(400).send({ msg: 'Invalid request body. Username and displayName are required and should be strings.' });
    // }

    //Previously storing info in Array Mock user, now shifted to DB
    const result = validationResult(request);
    console.log(result);
    if(!result.isEmpty()){
        return response.status(400).send({ errors: result.array()});
    }
    const data = matchedData(request);
    console.log(data);//validated fields
    // const newUser = { id: mockUsers[mockUsers.length-1] + 1, ...data};
    // mockUsers.push(newUser);
    // return response.status(201).send(newUser);

    //const { body } = request;
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try{
        const savedUser = await newUser.save();
        return response.status(201).send(savedUser);
    }catch(err){
        console.log(err);
        return response.sendStatus(400);
    }
};