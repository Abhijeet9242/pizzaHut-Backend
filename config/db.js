const mongoose = require('mongoose');

require('dotenv').config();
const LINK = process.env.DB_LINK;

module.exports = () => {
    return mongoose.connect(LINK);
}