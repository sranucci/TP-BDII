const dotenv = require("dotenv").config();
const express = require('express');
const {executeQuery, destroyPool} = require('./datasource')

const app = express()
const port = parseInt(process.env.PORT || "3000");
app.listen(port);

app.use(express.json());


// Middleware for logging incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`);
    
    // Log the HTTP status code
    res.on('finish', () => {
      console.log(`Response status code: ${res.statusCode}`);
    });
  
    next();
});
  

app.get('/', (req, res) => {
    //todo
});

app.get('/users', (req, res) => {
    executeQuery('SELECT * FROM E01_CLIENTE')
        .then( (result) => res.json(result) )
});

app.get('/users/:id', (req, res, next) => {
    const {id} = req.params;

    executeQuery('SELECT * FROM E01_CLIENTE WHERE nro_cliente = ?', id)
        .then( (result) => {
            if (!result.length)
                next()
            else
                res.json(result)
        } )
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
        .then(response => res.status(201).end())
        .catch(err => console.log(err));
    
});

app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const {nombre, apellido, direccion, activo} = req.body;
    executeQuery('UPDATE E01_CLIENTE SET nombre = ?, apellido = ?, direccion = ?, activo = ? WHERE nro_cliente = ?', nombre, apellido, direccion, activo, id)
        .then(response => res.status(200).end())
        .catch(err => console.log(err));
});

app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    executeQuery('DELETE FROM E01_CLIENTE WHERE nro_cliente = ?', id)
        .then(() => res.status(200).end())
        .catch(err => console.log(err));
});

// If the route doesn't exist
app.use((req, res) => {
    res.status(404).json({Error: "The resource doesn't exist"}).end();
});

// To catch Ctrl + C
process.on('SIGINT', function() {
    console.log("Shutting off server");

    destroyPool();
    process.exit();
});