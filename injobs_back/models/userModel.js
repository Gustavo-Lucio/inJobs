const connectDB = require('../config/db')

async function getUserCollection() {
    const db = await connectDB()
    return db.collection('users')
}

module.exports = {getUserCollection}