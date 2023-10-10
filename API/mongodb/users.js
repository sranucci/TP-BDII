const express = require('express');
const router = express.Router();
const db = require('./datasource')

//todo api methods

router.get('/', (req, res) => {
    
    db.collection("E01_CLIENTE").find({}).then(
        (result) => res.json(result)
    );
    
});

router.post('/', (req, res) => {
    const {nro_cliente, nombre, apellido, direccion, activo} = req.body;
});

router.get('/:id', (req, res, next) => {
    const {id} = req.params;
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {nombre, apellido, direccion, activo} = req.body;
});

module.exports = router;