const express = require('express');
const {getdb} = require("./datasource");
const router = express.Router();

//todo api methods

router.post("/", async (req, res) => {
    const { codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;
    const db = await getdb();

    try{
        await db.collection("E01_PRODUCTO").insertOne({codigo_producto,marca,nombre,descripcion,precio,stock});
    } catch (err){
        res.status(500).end();
    }
    res.status(201).end();

});


router.put("/:id", async (req,res) => {
    const oldId = parseInt(req.params.id);
    const db = await getdb();
    const { codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;
    const update = {};
    if (codigo_producto)
        update.codigo_producto = codigo_producto;
    if (marca)
        update.marca = marca;
    if (nombre)
        update.nombre = nombre;
    if (descripcion)
        update.descripcion = descripcion;
    if (precio)
        update.precio = precio;
    if (stock)
        update.stock = stock;

    try {
        const {matchedCount} = await db.collection("E01_PRODUCTO").updateOne({codigo_producto : oldId}, {$set :update});
        matchedCount === 1 ? res.status(200).end(): res.status(404).end();
    } catch (err){
        res.status(500).end();
    }

});

module.exports = router;