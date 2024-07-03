# 🌐 Express.js Deep Dive: A Beginner's Journey

Welcome to the **Express.js Deep Dive** repository! This repository documents my journey following the [Express JS Full Course](https://youtube.com) on YouTube. Here, I cover challenges faced, questions raised, and the answers I found. Additionally, you will find suggestions for further exploration and project ideas.

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Package Management](#package-management)
4. [Routing](#routing)
5. [Middleware](#middleware)
6. [Validation](#validation)
7. [Database Interaction](#database-interaction)
8. [Authentication & Authorization](#authentication--authorization)
9. [Testing](#testing)
10. [Project Ideas](#project-ideas)
11. [Acknowledgements](#acknowledgements)

---

## Introduction

This repository is a comprehensive guide through the basics of Express.js. If you're a beginner looking to get hands-on with Express.js, you're in the right place!

## Getting Started

### What is Express JS?

Express.js is a minimal and flexible Node.js web application framework that provides robust features for web and mobile applications. It facilitates the rapid development of Node-based web applications.

### What do we mean by server-side application?

A server-side application refers to software that runs on the server, handling requests from clients, performing operations, and sending responses back to the clients.

---

## Package Management

### Initializing a Node.js Project

```bash
mkdir my-express-app
cd my-express-app
npm init -y
```
**Wondering why we use -y? The -y flag answers "yes" to all prompts during initialization, creating a package.json file with default settings.**

### Install Express.js and other dev dependencies
```bash
npm install express
npm install -D nodemon
```

**The -D flag (or --save-dev) adds nodemon to devDependencies, which are used only in development environments. This ensures that your production package is not inflated with unnecessary dependencies.**

### Scripts in `package.json`
Scripts in package.json automate tasks in your development workflow. Run scripts using `npm run <script-name>`. Example `npm run test`.

```json
  "scripts": {
    "test": "jest",
    "test:e2e": "jest --testPathPatern=src/e2e",
    "start:dev": "nodemon ./src/index.js",
    "start": "node ./src/index.js"
  }
```

### Module Type
Setting `"type": "module"` in `package.json` configures the project to use ECMAScript Modules (ESM):
```json
"type": "module"
```
- Use  `import` and `export` statements with ESM.
- CommonJS ("type": "commonjs") uses `require` and `module.exports`.

### File Extensions

- `.js` treated as **ESM if "type": "module"** is set.
- `.mjs` explicitly indicates **ESM**.
- `.cjs` explicitly indicates **CommonJS**.

## Routing
### Route Paths and Parameters
[REST API Basics](https://youtu.be/lsMQRaeKNDk?si=B2CGwB9_PWwDfdZ7)

[Read about basics of using express routes](https://expressjs.com/en/guide/routing.html)

Example requests:
```javascript
// Basic request
app.get('/api/users', (req, res) => {
    res.send('GET request to the homepage');
});

//Request with route param -> /api/users/<123>, here `id` extracts 123 
app.get('/api/users/:id', (req, res) => {
    const parsedId = parseInt(request.params.id);
    //Ensure passed id is correct. Instilling validations at every steps prevents your application from breaking unexpectdly. 
    if(isNaN(parsedId)){
        return response.status(400).send({msg: 'Bad Request. Invalid ID'});
    }
    res.send(`User ID is ${userId}`);
});

```
Using **'api/users'** instead of just **'users'** in your route paths is a good industry practice for several reasons.
- **Clear Separation:** It clearly separates your API routes from other routes that may serve HTML pages or static files. This is especially useful in projects that serve both web pages and APIs.
- **Scalability:** As your application grows, having a clear namespace for your API routes helps maintain organization and prevents route conflicts. For example, you can have both /users for the web interface and /api/users for the API without confusion.
- **Versioning:** It facilitates easy versioning of your API. For instance, you can have /api/v1/users and /api/v2/users for different versions of your API, making it simpler to manage changes and deprecations.
- **Consistency:** Following this practice brings consistency to your codebase, making it easier for new developers to understand the structure of your application.
- **Security:** By separating your API routes, you can apply different middleware and security measures to your API endpoints compared to your web routes, enhancing the security of your application.

You can use Postman/Thunder Client to make API requests to your endpoint.

### Query Parameters
Always ensure proper error handling of query params. (More structured validations were covered in later sections)

```javascript
router.get('/api/users', (request, response) => {
    const {
        query: {filter, value}
    } = request; //Destructring query params
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
```

## Middleware
Middleware is a request handler that allows you to intercept and manipulate requests and responses before they reach route handlers. For example, `app.use(express.json())` registers a middleware with your express app which ensures that incoming requests with JSON payloads are parsed and made available as req.body objects in subsequent route handlers.
The order of registering middleware matters for its proper execution.

**More to explore: ...body -> Did you notice spread operator in tutorial? Read more on how it works internally?**


## Validation
Validation is crucial for maintaining data integrity and security in production applications. To streamline validation logic and reduce code duplication, leverage schema validation libraries such as `Joi` and `express-validator` for Node.js. These libraries allow you to define validation rules centrally, ensuring consistency across your application's functions and endpoints.

**More to explore: Dive deep into schema libraries and how they are utilised in production applications?**
**More to know: If there is no explicit return statement in a function, JavaScript implicitly returns undefined by default.**

## Database Interaction 
### Mongoose vs. MongoDB Native Driver
Mongoose is preferred over the MongoDB Native Driver for its ease of use and productivity enhancements. It provides a schema-based modeling approach, simplifying data validation and defining relationships between data. Mongoose also offers built-in features like middleware, schema validation, and easy querying, making it ideal for rapid development and maintaining code clarity in MongoDB applications.

## Session Management
- `saveUninitialized: false` prevents storing unnecessary sessions. It ensures that a session is only created when necessary data is added to it, thereby saving storage space and improving performance.
- `resave: false` prevents updates to session data when there are no changes in the session object. This avoids unnecessary updates to the session store's timestamp, optimizing resource usage and session management efficiency.

## Authentication & Authorization
### Passport.js Integration
Learn to integrate [Passport.js](https://www.passportjs.org/) for authentication in Express.js. Passport.js provides a flexible and modular authentication middleware for Node.js applications, supporting various authentication mechanisms like OAuth, OAuth2, JWT, etc.

### What is OAuth2?
OAuth2 is an authorization framework that allows third-party applications to obtain limited access to an HTTP service on behalf of a user, without exposing the user's credentials. [Learn More](https://auth0.com/intro-to-iam/what-is-oauth-2)

**More to explore: How can you prevent your secrets from getting pushed to public repo by mistake? Are there any libraries or frameworks that assist in that?**

There are various ways to handle this:
- Environment Variables: Store secrets in environment variables and use libraries like `dotenv` in Node.js to manage them locally.
- Git Ignore: Add sensitive files (e.g., .env) to .gitignore to ensure they are not tracked by Git.
- Secrets Management Tools: Utilize secrets management tools like AWS Secrets Manager, HashiCorp Vault, or Azure Key Vault for secure storage and access control.
- Static Code Analysis: Use tools like GitGuardian or TruffleHog to scan repositories for potential exposed secrets and tokens.

## Testing
### Unit Testing with Jest

#### Why Babel is used with Jest?
Babel is used with Jest so that Jest can understand and test modern JavaScript features and ES modules. These newer features might not be supported directly by Node.js or older web browsers. Babel helps by converting these modern JavaScript codes into a format that Jest and older environments can understand, making sure our tests run smoothly and accurately across different setups.

#### Difference between `test` and `spec`
- Test: Refers to individual test cases or units of code being tested within a testing framework like Jest or Mocha.
- Spec: Refers to the specification file where test cases and their expected behaviors are described, commonly used in frameworks like Jasmine or RSpec.

Both terms are used to describe different aspects of the testing process within different testing frameworks, but their exact usage and meaning can vary slightly depending on the framework being used. It is commonly used interchangeably in industry.

#### Mock Functions in Unit Testing
Mock functions are simulated functions that mimic the behavior of real functions within a controlled environment, typically used for testing purposes, since it's impractical and undesirable to call actual functions directly for each test case.

#### Intresting difference in request mocking between JS and TS
```javascript
// Empty request and response with eg test
const mockRequest = {
    
};
const mockResponse = {

};

it('should return 400 when errors found', async () => {
        await createUserHandler(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid username' }] });
    });

```
Passing empty mockRequest to tests works in JavaScript but will error out in Typescript.
This is because **JavaScript is dynamically typed**. This means you can add or remove properties from objects freely at runtime without strict type checking.

However, **TypeScript (TS) is statically typed**. It enforces type checking at compile time, which means every property you access on an object must conform to its type definition. If you define mockRequest and mockResponse with specific types or interfaces that include properties like cookies or headers, TypeScript expects those properties to be present when you use these objects.

```typescript
interface MockRequest {
    method: string;
    path: string;
    // ? to mark properties as optional
    cookies?: any;
    headers?: any;
}

// Mock object in TS will error out if required parameters are missing.
const mockRequest: MockRequest = {
    method: 'GET',
    path: '/api',
    // Optional properties like cookies and headers can be omitted
};
```

## Project Ideas
- **User Authentication System:** Implement a exhaustive authentication system. Explore various authorization options including local auth, 3rd party apps etc.
- **API with Validation:** Create an API that includes comprehensive validation using express-validator and other tools.

## Acknowledgements
Special thanks to @stuyy for the excellent tutorial.
[Github Link](https://github.com/stuyy/expressjs-full-course)

Happy coding! 🚀
