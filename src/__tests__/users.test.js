import { getUserByIdHandler, createUserHandler } from '../handlers/users.js'
import { mockUsers } from '../utils/constants.js';
import * as validator from 'express-validator';
import * as helpers from '../utils/helpers.js'
import { User } from '../mongoose/schemas/user.js'
jest.mock('express-validator', () =>({
   validationResult: jest.fn(
    ()=> ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{msg: 'Invalid username' }]),
    })
   ),
   matchedData: jest.fn(() => ({
        username: "test",
        password: "password",
        displayName:"test_name",
   })), 
}));

    
jest.mock('../utils/helpers.js', () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock('../mongoose/schemas/user.js');

//request.params.id
const mockRequest = {
    params: {
        id: 1
    }
};

const mockRequest2 = {
    params: {
        id: 90
    }
};

const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn(),
    status: jest.fn(() => mockResponse),//helps in execcutinf.status().send()
}

describe('get users', () => {
    it('should get user by id', () => {
         getUserByIdHandler(mockRequest, mockResponse);

         //expect(mockResponse.send).toHaveBeenCalled();
         expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[0]);
         expect(mockResponse.sendStatus).not.toHaveBeenCalled();
         expect(mockResponse.send).toHaveBeenCalledTimes(1);
    });

    if('should call 404 when user not found', () => {
        getUserByIdHandler(mockRequest2, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    });
});

describe('create user ', () => {

    const mockRequest  = {

    }

    it('should return 400 when errors found', async () => {
        await createUserHandler(mockRequest, mockResponse);
        expect(validator.validationResult).toHaveBeenCalledTimes(1);
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid username' }] });
    });

    it('successful user creation - 201', async () => {
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({isEmpty: jest.fn(() => true)}));

        const saveMethod = jest.spyOn(User.prototype, "save").mockResolvedValueOnce({
            id: 1,
            username: "test",
            password: "hashed_password",
            displayName:"test_name",
       });

        await createUserHandler(mockRequest, mockResponse);
        expect(validator.matchedData).toHaveBeenCalled();
        expect(helpers.hashPassword).toHaveBeenCalledWith("password");
        expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
        expect(User).toHaveBeenCalledWith({
            username: "test",
            password: "hashed_password",
            displayName:"test_name",
       });
       console.log(User.mock.instances[0]);
       expect(saveMethod).toHaveBeenCalled();
       //expect(User.mock.instances[0].save).toHaveBeenCalled();
       expect(mockResponse.status).toHaveBeenCalledWith(201);
       expect(mockResponse.send).toHaveBeenCalledWith({
        id: 1,
        username: "test",
        password: "hashed_password",
        displayName:"test_name",
   });
    });

    it('save failed - 400', async () => {
        jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({isEmpty: jest.fn(() => true)}));
        const saveMethod = jest.spyOn(User.prototype, "save").mockImplementationOnce(() => Promise.reject("failed to save user"));
        await createUserHandler(mockRequest, mockResponse);
        expect(saveMethod).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });
});