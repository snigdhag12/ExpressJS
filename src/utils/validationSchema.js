export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: "username must be atlease 5 and max 30 characters",
        },
        notEmpty: {
            errorMessage: "Username cannot be empty",
        },
        isString: {
            errorMessage: "Username should be string"
        },
    },
    displayName: {
        notEmpty: {
            errorMessage: "Username cannot be empty",
        },
    },
    password: {
        notEmpty: true,
    },
};