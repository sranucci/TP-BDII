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

    executeQuery('INSERT INTO E01_CLIENTE VALUES (?,?,?,?,?)',nro_cliente, nombre, apellido, direccion, activo)
    .then(response => res.status(200).end())
    .catch(err => console.log(err));
        
});

app.post("/products", (req, res) => {
    /*
    create table E01_PRODUCTO
(
    codigo_producto int         not null
        primary key,
    marca           varchar(45) not null,
    nombre          varchar(45) not null,
    descripcion     varchar(45) not null,
    precio          float       not null,
    stock           int         not null
);

    */
   const { codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;
   executeQuery('INSERT INTO E01_PRODUCTO values (?,?,?,?,?,?)', codigo_producto, marca, nombre, descripcion, precio, stock)
   .then(response => res.status(200).end())
   .catch(err => console.log(err));
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