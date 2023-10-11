const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'BDII-TPO';
let client;
let db;

let func = async () => {
    client = await MongoClient.connect(url);
}


async function getdb(databaseName){
    if (client){
        return client.db(databaseName);
    }
    client = await MongoClient.connect(url);
    return client.db(databaseName);
}


module.exports = {getdb}