const express = require('express');
const router = express.Router();
const {executeQuery} = require('./datasource');


router.get("/:id", async (req,res,next) => {
    const {id} = req.params;
    
    executeQuery("SELECT * FROM E01_PRODUCTO WHERE codigo_producto = ?",parseInt(id))
    .then(response => response.length > 0 ? res.status(200).json(response).end() : res.status(404).end())
    .catch( err => res.status(500).end());

});


router.get("/",async (req,res) => {

    const {id} = req.params;
    
    executeQuery("SELECT * FROM E01_PRODUCTO",parseInt(id))
    .then(response => response.length > 0 ? res.status(200).json(response).end() : res.status(404).end())
    .catch( err => res.status(500).end());

})


// If the route doesn't exist
router.post("/", (req, res) => {
   const { codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;
   executeQuery('INSERT INTO E01_PRODUCTO values (?,?,?,?,?,?)', codigo_producto, marca, nombre, descripcion, precio, stock)
   .then(response => res.status(200).end())
   .catch(err => {
       console.log(err);
       res.status(500).end();
   });
});


router.put("/:id", (req,res) => {
    
    const oldId = parseInt(req.params.id);
    const { codigo_producto, marca, nombre, descripcion, precio, stock} = req.body;

    executeQuery("UPDATE E01_PRODUCTO SET codigo_producto = ?, marca = ?, nombre = ?, descripcion = ?, precio = ?, stock = ? "+
    "WHERE codigo_producto = ?",codigo_producto,marca,nombre,descripcion,precio,stock,oldId)
    .then(response => response.changedRows > 0 ? res.status(200).end() : res.status(404).end())
    .catch(err => console.log(err));
});


module.exports = router;