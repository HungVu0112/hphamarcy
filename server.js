require('dotenv').config({ path: "../.env" });

const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.use('/api/product', productRoutes);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(
            process.env.PRODUCT_PORT,
            () => console.log(`Connected to database and Product service running on port ${process.env.PRODUCT_PORT}`)
        )
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });