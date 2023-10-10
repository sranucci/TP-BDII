const express = require('express');
const router = express.Router();
const {executeQuery} = require('./datasource') //todo

router.get('/', (req, res) => {
    executeQuery('SELECT * FROM E01_CLIENTE')
        .then( (result) => res.json(result) )
});

router.post('/', (req, res) => {
    //todo
    const {nro_cliente, nombre, apellido, direccion, activo} = req.body;

    executeQuery('INSERT INTO E01_CLIENTE VALUES (?,?,?,?,?)',nro_cliente, nombre, apellido, direccion, activo)
        .then(response => res.status(201).end())
        .catch(err => console.log(err));
    
});

router.get('/:id', (req, res, next) => {
    const {id} = req.params;

    executeQuery('SELECT * FROM E01_CLIENTE WHERE nro_cliente = ?', id)
        .then( (result) => {
            if (!result.length)
                next()
            else
                res.json(result)
        } )
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    executeQuery('DELETE FROM E01_CLIENTE WHERE nro_cliente = ?', id)
        .then(() => res.status(200).end())
        .catch(err => console.log(err));
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {nombre, apellido, direccion, activo} = req.body;
    executeQuery('UPDATE E01_CLIENTE SET nombre = ?, apellido = ?, direccion = ?, activo = ? WHERE nro_cliente = ?', nombre, apellido, direccion, activo, id)
        .then(response => res.status(200).end())
        .catch(err => console.log(err));
});

module.exports = router