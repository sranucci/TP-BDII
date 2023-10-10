const dotenv = require("dotenv").config();
const express = require('express');
const {destroyPool} = require('./mysql/datasource')
const mysqlRouter = require('./mysql/router');
const mongodbRouter = require('./mongodb/router');

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middlewares
app.use(express.json());
app.use(logger);

// Routers
app.use('/mysql', mysqlRouter);
app.use('/mongo', mongodbRouter);

// If the request didn't match any routes
app.use(handle404);

process.on('SIGINT', shutDownServer);

app.listen(port, () => console.log(`server started listening on port ${port}`));

function logger(req, res, next) {
    console.log(`Received ${req.method} request at ${req.url}`);
    res.on('finish', () => {
      console.log(`Response status code: ${res.statusCode}`);
    });
    next();
}

function handle404(req, res) {
    res.status(404).json({Error: "The resource doesn't exist"}).end();
}

function shutDownServer() {
    console.log("Shutting off server");
    destroyPool();
    process.exit();
}