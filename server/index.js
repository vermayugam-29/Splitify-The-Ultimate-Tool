const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT;

const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

//cors
const cors = require('cors');

// app.use(cors(
//     {
//         origin: '*',
//         methods: ['GET', 'PUT', 'POST', 'DELETE'],
//         credentials: true
//     }
// ));

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow all origins
        return callback(null, true);
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true
}));



const db = require('./config/database');
db.connect();


const router = require('./routes/userRoutes')
app.use('/api/v1', router)

app.get('/' , (req , res) => {
    res.json({
        success : true,
        testing : 'Working fine'
    })
})

app.listen(PORT, () => {
    console.log(`Successfully Connected at ${PORT}`)
})