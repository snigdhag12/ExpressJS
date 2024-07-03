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
10. [Further Exploration](#further-exploration)
11. [Project Ideas](#project-ideas)
12. [Acknowledgements](#acknowledgements)

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

**The -D flag (or --save-dev) adds nodemon to devDependencies, which are used only in development environments. This ensures that your production package is not inflated with unnecessary dependencies**

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

### Middleware
Middleware is a request handler that allows you to intercept and manipulate requests and responses before they reach route handlers. For example, `app.use(express.json())` registers a middleware with your express app which ensures 
