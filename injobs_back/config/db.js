const { MongoClient } = require('mongodb');
const url = `mongodb+srv://tccinjobs:tccinjobs@tccinjobs.9wc4b.mongodb.net/?retryWrites=true&w=majority&appName=tccinjobs`;

const client = new MongoClient(url);
let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('tccinjobs');
        console.log('MongoDB connected');
    }
    return db;
}

module.exports = connectDB;