const connectDB = require('../config/db')

async function getConnectionCollection() {
    const db = await connectDB()
    return db.collection('connections')
}

module.exports = {getConnectionCollection}