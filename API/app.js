const dotenv = require("dotenv").config();
const express = require('express');
const {executeQuery, destroyPool} = require('./datasource')

const app = express()
const port = parseInt(process.env.PORT || "3000");
app.listen(port);

app.use(express.json());

app.get('/', (req, res) => {
    //todo
});

app.get('/users', (req, res) => {
    executeQuery('SELECT * FROM E01_CLIENTE')
        .then( (result) => res.json(result) )
});

app.get('/users/:id', (req, res) => {
    const {id} = req.params;

    executeQuery('SELECT * FROM E01_CLIENTE WHERE nro_cliente = ?', id)
        .then( (result) => res.json(result) )
});

app.post('/users', (req, res) => {
    //todo
})

app.use((req, res) => {
    res.status(404).end()
});

// To catch Ctrl + C
process.on('SIGINT', function() {
    console.log("Shutting off server");

    destroyPool()
    process.exit();
});