const express = require('express');
const {getdb} = require("./datasource");
const router = express.Router();

router.post("/", async (req, res) => {
    const {codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;

    if (!codigo_producto || !marca || !nombre || !descripcion || !precio || !stock) {
        return res.status(400).json({error: 'Missing required fields. Please provide values for codigo_producto, marca, nombre, descripcion, precio and stock.'});
    }

    let db = null;
    try {
        db = await getdb();
    } catch (err) {
        console.error("DB connection error:", err);
        return res.status(500).json({error: "DB connection error"}).end();
    }

    try {
        await db.collection("E01_PRODUCTO").insertOne({codigo_producto, marca, nombre, descripcion, precio, stock});
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error, return a bad request
            return res.status(400).json({error: 'Duplicate key violation. The specified codigo_producto already exists.'});
        } else {
            console.error(err);
            // Other errors, return internal server error
            return res.status(500).end();
        }
    }
    res.status(201).end();

});


router.put("/:id", async (req, res) => {
    const oldId = parseInt(req.params.id);
    let db = null;
    try {
        db = await getdb();
    } catch (err) {
        console.error("DB connection error:", err);
        return res.status(500).json({error: "DB connection error"}).end();
    }
    const {codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;
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
        const {matchedCount} = await db.collection("E01_PRODUCTO").updateOne({codigo_producto: oldId}, {$set: update});
        matchedCount === 1 ? res.status(200).end() : res.status(404).end();
    } catch (err) {
        res.status(500).end();
    }

});

module.exports = router;