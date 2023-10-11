const mysql = require('mysql2');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'BDII-TPO';

// Create a connection to the MySQL server
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'mri2022bd2',
});


const executeQuery = async (query, ...values) => {
    return new Promise( (resolve, reject) => { connection.query(query, [...values], (err, rows, fields) => {
        if (err){
            reject(err);
        }
        resolve(rows);
    })});
};

const doMigration = async () => {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const sqlClients = await executeQuery("SELECT distinct * FROM E01_CLIENTE c");
    
    try {
        await db.createCollection("E01_CLIENTE");
        await db.createCollection("E01_FACTURA");
        await db.createCollection("E01_DETALLE_FACTURA");
        await db.createCollection("E01_PRODUCTO");
        
        for (let client of sqlClients) {
            let telefonos = await executeQuery("SELECT * FROM E01_TELEFONO WHERE nro_cliente = ?",client.nro_cliente);

            telefonos.forEach( telefono => delete telefono.nro_cliente);

            if (telefonos.length !== 0){
                client.telefonos = telefonos;
            }
        }
        const result = await db.collection("E01_CLIENTE").insertMany(sqlClients);
        await db.collection("E01_CLIENTE").createIndex({nro_cliente: 1});
        console.log("Clients Migrated");

        const sqlFacturas = await executeQuery("SELECT * FROM E01_FACTURA");
        await db.collection("E01_FACTURA").insertMany(sqlFacturas);
        await db.collection("E01_FACTURA").createIndex({nro_factura: 1});
        console.log("Facturas Migrated");

        const sqlDetalleFactura = await executeQuery("SELECT * FROM E01_DETALLE_FACTURA");
        await db.collection("E01_DETALLE_FACTURA").insertMany(sqlDetalleFactura);
        console.log("Facturas Details Migrated");

        const sqlProducto = await executeQuery("SELECT * FROM E01_PRODUCTO");
        await db.collection("E01_PRODUCTO").insertMany(sqlProducto);
        await db.collection("E01_PRODUCTO").createIndex({codigo_producto: 1});
        console.log("Products Migrated");
        
    } catch (err) {
        console.error("Migration Failed", err);
    } finally {
        connection.destroy();
        await client.close();
    }
}

doMigration().then(() => console.log("Migration Finished"));



