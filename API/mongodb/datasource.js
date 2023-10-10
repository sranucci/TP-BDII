const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'BDII-TPO';

const client = await MongoClient.connect(url);
const db = client.db(dbName);

module.exports = {db}