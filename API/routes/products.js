const express = require('express');
const router = express.Router();
const {executeQuery} = require('../datasource')

// If the route doesn't exist
router.post("/", (req, res) => {
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
});


router.put("/:id", (req,res) => {
    
    const oldId = parseInt(req.params.id);
    const { codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;

    executeQuery("UPDATE E01_PRODUCTO SET codigo_producto = ?, marca = ?, nombre = ?, descripcion = ?, precio = ?, stock = ? "+
    "WHERE codigo_producto = ?",codigo_producto,marca,nombre,descripcion,precio,stock,oldId)
    .then(response => res.status(200).end())
    .catch(err => console.log(err));
});


module.exports = router;