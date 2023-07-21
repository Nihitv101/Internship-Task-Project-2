const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/dbconfig');
connectDB();
const routes = require('./routes/order.route.js');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);






app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);

})
