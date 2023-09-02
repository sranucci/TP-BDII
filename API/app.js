const dotenv = require("dotenv").config();
const express = require('express');
const {executeQuery, destroyPool} = require('./datasource')

const app = express()
const port = parseInt(process.env.PORT || "3000");
app.listen(port);

app.use(express.json());

app.get('/', (req, res) => {
    //hacer la consulta sql
    //devolver el json
    executeQuery('SELECT * FROM E01_CLIENTE')
    .then( (result) => res.json(result) )
    .catch( (result) => res.status(404));
    
    
});

app.get('/users/:id', (req, res) => {
    //do things
    const {id} = req.params;
})

// To catch Ctrl + C
process.on('SIGINT', function() {
    console.log("Shutting off server");

    destroyPool()
    process.exit();
});