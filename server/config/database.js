const mongoose = require('mongoose');

require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL , {
        useNewurlParser : true,
        useUnifiedTopology : true
    })
    .then(() => {
        console.log('Connected to Database Successfully')
    })
    .catch((err) => {
        console.error(err.message);
        console.log('Error Connecting to databse');
    })
}