const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'BDII-TPO';
let client;
let db;

let func = async () => {
    client = await MongoClient.connect(url);
}


async function getdb(){
    if (client){
        return client.db(dbName);
    }
    client = await MongoClient.connect(url);
    return client.db(dbName);
}


module.exports = {getdb}