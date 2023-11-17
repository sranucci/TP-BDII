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

    if (!nro_cliente || !nombre || !apellido || !direccion || !activo) {
        return res.status(400).json({error: 'Missing required fields. Please provide values for nro_cliente, nombre, apellido, direccion, and activo.'});
    }

    executeQuery('INSERT INTO E01_CLIENTE VALUES (?,?,?,?,?)',nro_cliente, nombre, apellido, direccion, activo)
        .then(response => res.status(201).end())
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
    
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
    const string = "UPDATE E01_CLIENTE SET ";
    const values = [];
    if (nombre) {
        string.concat("nombre = ?, ");
        values.push(nombre);
    }
    if (apellido) {
        string.concat("apellido = ?, ");
        values.push(apellido);
    }
    if (direccion) {
        string.concat("direccion = ?, ");
        values.push(direccion);
    }
    if (activo) {
        string.concat("activo = ?, ");
        values.push(activo);
    }
    string.concat(" WHERE nro_cliente = ? ")
    values.push(id);
    executeQuery(string, ...values)
        .then(response => res.status(200).end())
        .catch(err => console.log(err));
});

module.exports = router