const express = require('express');
const router = express.Router();
const {getdb} = require('./datasource')

//todo error handling

//todo api methods

router.get('/', async (req, res) => {
    let db = null;
    try {
        db = await getdb();
    } catch (err) {
        console.error("DB connection error:", err);
        return res.status(500).json({error: "DB connection error"}).end();
    }

    try {
        const result = await db.collection("E01_CLIENTE").find({}).toArray();

        if (result.length === 0) {
            res.status(404).json({message: "No data found"});
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({message: "An error occurred", error: err});
    }
});

router.post('/', async (req, res, next) => {
    let {nro_cliente, nombre, apellido, direccion, activo, telefonos} = req.body;

    if (!nro_cliente || !nombre || !apellido || !direccion || !activo) {
        return res.status(400).json({error: 'Missing required fields. Please provide values for nro_cliente, nombre, apellido, direccion, and activo.'});
    }

    if (telefonos && Array.isArray(telefonos)) {
        for (const telefono of telefonos) {
            if (typeof telefono.codigo_area === 'undefined' ||
                typeof telefono.nro_telefono === 'undefined' ||
                typeof telefono.tipo === 'undefined') {
                return res.status(400).json({
                    error: 'Missing required fields for telefono. Please provide values for codigo_area, nro_telefono, and tipo.'
                });
            }
        }
    } else if (!Array.isArray(telefonos)) {
        telefonos = [];
    }


    try {
        const db = await getdb();
        await db.collection("E01_CLIENTE").insertOne({nro_cliente, nombre, apellido, direccion, activo, telefonos});
        res.status(201).end();
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error, return a bad request
            res.status(400).json({error: 'Duplicate key violation. The specified nro_cliente already exists.'});
        } else {
            console.error(err);
            // Other errors, return internal server error
            res.status(500).end();
        }
    }
});

router.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    let db = null;
    try {
        db = await getdb();
    } catch (err) {
        console.error("DB connection error:", err);
        return res.status(500).end();
    }

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

    // Validate Input
    if (isNaN(id)) {
        return res.status(400).json({error: 'Invalid client ID.'});
    }

    try {
        // Perform DB operation
        const deletionResult = await db.collection("E01_CLIENTE").deleteOne({nro_cliente: parseInt(id)});

        if (deletionResult.deletedCount === 0) {
            return res.status(404).json({error: 'Client not found.'});
        }

        res.status(200).json({success: 'Client deleted successfully.'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'An error occurred, please try again later.'});
    }
});
router.put('/:id', async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({error: 'Missing required fields. Please provide values for id.'});
    }

    let {nombre, apellido, direccion, activo, telefonos} = req.body || {};

    const setData = {};
    if (nombre !== null && nombre !== undefined) {
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

    if (telefonos && Array.isArray(telefonos)) {
        for (const telefono of telefonos) {
            if (typeof telefono.codigo_area === 'undefined' ||
                typeof telefono.nro_telefono === 'undefined' ||
                typeof telefono.tipo === 'undefined') {
                return res.status(400).json({
                    error: 'Missing required fields for telefono. Please provide values for codigo_area, nro_telefono, and tipo.'
                });
            }
        }
        setData.telefonos = telefonos;
    } else {
        setData.telefonos = [];
    }

    let db = null;
    try {
        db = await getdb();
    } catch (err) {
        console.error("DB connection error:", err);
        return res.status(500).end();
    }

    let result = null;

    try {
        result = await db.collection("E01_CLIENTE").updateOne({nro_cliente: parseInt(id)}, {$set: setData});
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error, return a bad request
            return res.status(400).json({error: 'Duplicate key violation.'});
        } else {
            console.error(err);
            // Other errors, return internal server error
            return res.status(500).end();
        }
    }

    result.modifiedCount === 1 ? res.status(200).end() : res.status(404).json({error: "Record not found"}).end();

});

module.exports = router;