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
    const {nro_cliente, nombre, apellido, direccion, activo} = req.body;
    /*
    nro_cliente int         not null
        primary key,
    nombre      varchar(45) not null,
    apellido    varchar(45) not null,
    direccion   varchar(45) not null,
    activo      smallint    not null
    */
    executeQuery('INSERT INTO E01_CLIENTE VALUES (?,?,?,?,?)',nro_cliente, nombre, apellido, direccion, activo)
    .then(response => res.status(200).end())
    .catch(err => console.log(err));
    
});

app.use((req, res) => {
    res.status(404).end()
});

// To catch Ctrl + C
process.on('SIGINT', function() {
    console.log("Shutting off server");

    destroyPool()
    process.exit();
});