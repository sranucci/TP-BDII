const express = require('express');
const router = express.Router();

//todo api methods

router.post("/", (req, res) => {
    const { codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;
});


router.put("/:id", (req,res) => {
    const oldId = parseInt(req.params.id);
    const { codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;
});

module.exports = router;