const express = require('express');
const router = express.Router();
const {getdb}= require('./datasource')

//todo error handling

//todo api methods

router.get('/', async (req, res) => {
    try {
        const db = await getdb();
        const result = await db.collection("E01_CLIENTE").find({}).toArray();
    
        if(result.length === 0) {
            res.status(404).json({message: "No data found"});
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({message: "An error occurred", error: err});
    }
});

router.post('/', async  (req, res, next) => {
   const {nro_cliente, nombre, apellido, direccion, activo} = req.body;
   try {
       const db = await getdb();
       await db.collection("E01_CLIENTE").insertOne({nro_cliente, nombre, apellido, direccion, activo});
       res.status(201).end();
   } catch (err) {
       res.status(500).end();
   }
});

router.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    const db = await getdb();

    try {
        const result = await db.collection("E01_CLIENTE").findOne({nro_cliente: parseInt(id)})
        if (result) {
            res.status(200).json(result);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

});
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    const db = await getdb();
    db.collection("E01_CLIENTE").deleteOne({nro_cliente: parseInt(id)});
    res.status(200).end();
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {nombre, apellido, direccion, activo} = req.body;

    const setData = {};
    if ( nombre !== null && nombre !== undefined ){
        setData.nombre = nombre;
    }

    if (apellido !== null && apellido !== undefined) {
        setData.apellido = apellido;
    }

    if (direccion !== null && direccion !== undefined) {
        setData.direccion = direccion;
    }

    if (activo !== null && activo !== undefined) {
        setData.activo = activo
    }

    const db = await getdb();

    const result = await db.collection("E01_CLIENTE").updateOne({nro_cliente: parseInt(id)}, { $set : setData});

    result.modifiedCount === 1 ? res.status(200).end() : res.status(404).end();

});

module.exports = router;