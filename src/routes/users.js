import { Router } from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { createUserValidationSchema } from '../utils/validationSchema.js'
import { mockUsers } from '../utils/constants.js'
import {resolveUserByID, validateUser} from '../utils/middlewares.js'

const router = Router();


router.get('/api/users',  query('filter').isString().isLength({min: 3, max: 10}).withMessage('Character length invalid'), (request, response) => {
    const result = validationResult(request);
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
router.post('/api/users', checkSchema(createUserValidationSchema),
(request, response) => {

    // if(!validateUser(request.body)) {
    //     return response.status(400).send({ msg: 'Invalid request body. Username and displayName are required and should be strings.' });
    // }
    const result = validationResult(request);
    console.log(result);
    if(!result.isEmpty()){
        return response.status(400).send({ errors: result.array()});
    }
    const data = matchedData(request);
    console.log(data);//validated fields
    const newUser = { id: mockUsers[mockUsers.length-1] + 1, ...data};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
});

//route parameters
router.get("/api/users/:id", (request, response) => {
    const parsedId = parseInt(request.params.id);
    if(isNaN(parsedId)){
        return response.status(400).send({msg: 'Bad Request. Invalid ID'});
    }

    const findUser = mockUsers.find((user) => user.id === parsedId)
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

router.put("/api/users/:id", resolveUserByID, (request, response) => {
    const {
        body,
        findUserIndex,
    } = request;

    if(!validateUser(request.body)) {
        return response.status(400).send({ msg: 'Invalid request body. Username and displayName are required and should be strings.' });
    }

    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body};
    return response.sendStatus(200);
});

router.patch('/api/users/:id', resolveUserByID, (request, response) => {
    const {
        body,
        findUserIndex,
    } = request;

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex] , ...body}; //...body this will override the previous value
    return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveUserByID, (request, response) => {
    mockUsers.splice(request.findUserIndex, 1);
    return response.sendStatus(200);
});

export default router;