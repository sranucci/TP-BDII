// Import the routers
const usersRouter = require("./users");
const productsRouter = require("./products");

const express = require('express');
const router = express.Router();

// Use the router modules
router.use('/users', usersRouter);
router.use('/products', productsRouter);

module.exports = router