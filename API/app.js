const dotenv = require("dotenv").config();
const express = require('express');
const {destroyPool} = require('./datasource')

// Import the routers
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");

const app = express()
const port = parseInt(process.env.PORT || "3000");

app.use(express.json());


// Use the router modules
app.use('/users', usersRouter); // Mount the users router at the /users path
app.use('/products', productsRouter);

// Middleware for logging incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`);
    
    // Log the HTTP status code
    res.on('finish', () => {
      console.log(`Response status code: ${res.statusCode}`);
    });
  
    next();
});
  
app.use((req, res) => {
    res.status(404).json({Error: "The resource doesn't exist"}).end();
});

// To catch Ctrl + C
process.on('SIGINT', function() {
    console.log("Shutting off server");

    destroyPool();
    process.exit();
});

app.listen(port);

