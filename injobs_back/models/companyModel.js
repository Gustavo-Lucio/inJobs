const connectDB = require('../config/db');

async function getCompanyCollection() {
    const db = await connectDB();
    return db.collection('companies');
}

module.exports = { getCompanyCollection };