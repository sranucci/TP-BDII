const express = require('express');
const router = express.Router();
const {executeQuery} = require('./datasource') //todo

router.get('/', (req, res) => {
    executeQuery('SELECT * FROM E01_CLIENTE')
        .then((result) => res.json(result))
});

router.post('/', async (req, res, next) => {
    let {nro_cliente, nombre, apellido, direccion, activo, telefonos} = req.body;

    let setTelefonos;

    if (!nro_cliente || !nombre || !apellido || !direccion || !activo) {
        return res.status(400).json({error: 'Missing required fields. Please provide values for nro_cliente, nombre, apellido, direccion, and activo.'}).end();
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
        setTelefonos = telefonos;
    } else if (!Array.isArray(telefonos)) {
        setTelefonos = [];
    }

    try {
        await executeQuery('INSERT INTO E01_CLIENTE VALUES (?,?,?,?,?)', nro_cliente, nombre, apellido, direccion, activo);
        for (const telefono of setTelefonos) {
            try {
                await executeQuery('INSERT INTO E01_TELEFONO VALUES (?,?,?,?)', telefono.codigo_area, telefono.nro_telefono, telefono.tipo[0], nro_cliente);
            } catch (e) {
                if (e.errno === 1062 || e.errno === 1064 || e.errno === 1452) {
                    res.status(400).json({error: 'Duplicate key violation. The specified codigo_area and nro_telefono already exists.'});
                } else {
                    console.log(e);
                    res.status(500).end();
                }
            }
        }
    } catch (e) {
        if (e.errno === 1062 || e.errno === 1064 || e.errno === 1452) {
            res.status(400).json({error: 'Duplicate key violation. The specified nro_cliente already exists.'});
        } else {
            console.log(e);
            res.status(500).end();
        }
    }

    res.status(201).end();
});

router.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    let response = {telefonos: []};
    const result = await executeQuery('SELECT * FROM E01_CLIENTE WHERE nro_cliente = ?', parseInt(id));
    if (result.length) {
        response = result[0];
    } else {
        return res.status(404).json({error: 'The resource doesn\'t exist'}).end();
    }

    executeQuery('SELECT * FROM E01_TELEFONO WHERE nro_cliente = ?', parseInt(id))
        .then((result) => {
            if (!result.length)
                response.telefonos = [];
            else
                response.telefonos = result;
            res.json(response).status(200).end();
        })
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    await executeQuery('DELETE FROM E01_TELEFONO WHERE nro_cliente = ?', parseInt(id));
    try {
        const sqlResults = await executeQuery('DELETE FROM E01_CLIENTE WHERE nro_cliente = ?', parseInt(id))
        if (!sqlResults.affectedRows) {
            return res.status(404).json({error: 'The resource doesn\'t exist'}).end();
        }
        res.status(200).end();
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    let {nombre, apellido, direccion, activo, telefonos} = req.body;
    let string = "UPDATE E01_CLIENTE SET ";
    const values = [];
    let setTelefonos;

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
        setTelefonos = telefonos;
    } else {
        setTelefonos = [];
    }


    if (nombre) {
        if (values.length === 0)
            string = string.concat("nombre = ? ");
        else
            string = string.concat(", nombre = ? ");
        values.push(nombre);
    }
    if (apellido) {
        if (values.length === 0)
            string = string.concat("apellido = ? ");
        else
            string = string.concat(", apellido = ? ");
        values.push(apellido);
    }
    if (direccion) {
        if (values.length === 0)
            string = string.concat("direccion = ? ");
        else
            string = string.concat(", direccion = ? ");
        values.push(direccion);
    }
    if (activo) {
        if (values.length === 0)
            string = string.concat("activo = ? ");
        else
            string = string.concat(", activo = ? ");
        values.push(activo);
    }
    string = string.concat(" WHERE nro_cliente = ? ")
    values.push(parseInt(id));

    let sqlResult


    try {
        sqlResult = await executeQuery(string, ...values);
        if (!sqlResult.affectedRows) {
            return res.status(404).json({error: 'The resource doesn\'t exist'}).end();
        }
    } catch (e) {
        console.log(e);
        return res.status(500).end();
    }

    for (const telefono of setTelefonos) {
        try {
            sqlResult = await executeQuery('SELECT * FROM E01_TELEFONO WHERE codigo_area = ? AND nro_telefono = ?', telefono.codigo_area, telefono.nro_telefono);
            if (sqlResult.length) {
                await executeQuery('UPDATE E01_TELEFONO SET tipo = ?, nro_cliente = ? WHERE codigo_area = ? AND nro_telefono = ?', telefono.tipo[0], parseInt(id), telefono.codigo_area, telefono.nro_telefono);
            } else {
                await executeQuery('INSERT INTO E01_TELEFONO VALUES (?,?,?,?)', telefono.codigo_area, telefono.nro_telefono, telefono.tipo[0], parseInt(id));
            }
        } catch (ignored) {
            //
        }
    }

    return res.status(200).end();
});

module.exports = router