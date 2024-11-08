const connectDB = require('../config/db');

async function getJobCollection() {
    const db = await connectDB();
    return db.collection('jobs');
}

module.exports = { getJobCollection };
