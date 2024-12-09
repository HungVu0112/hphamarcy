require('dotenv').config({ path: "../.env" });

const express = require('express');
const orderRoutes= require('./routes/order');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.use('/api/order', orderRoutes);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(
            process.env.ORDER_PORT,
            () => {
                console.log(`Connected to database and Order service listening on port ${process.env.ORDER_PORT}`);
            }
        )
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });