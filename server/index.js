const express = require('express');
const app = express();
const path = require('path')

require('dotenv').config();
const PORT = process.env.PORT;

const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

//cors
const cors = require('cors');

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        return callback(null, true);
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true
}));



const db = require('./config/database');
db.connect();


const router = require('./routes/userRoutes')
app.use('/api/v1', router)

// app.get('/' , (req , res) => {
//     res.json({
//         success : true,
//         testing : 'Working fine'
//     })
// })

const __dirname1 = path.resolve();

if(process.env.NODE_ENV == 'development'){
    const staticPath = path.join(__dirname1, '../client' , 'build');

    app.use(express.static(staticPath));
    app.get('*', (req, res)=>{
        const indexPath = path.join(__dirname1, '../client', 'build', 'index.html');
        res.sendFile(indexPath);
    })
}


app.listen(PORT, () => {
    console.log(`Successfully Connected at ${PORT}`)
})