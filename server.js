require('dotenv').config({ path: "../.env" });

const express = require('express');
const mongoose = require('mongoose');
const userRouters = require('./routes/user');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.use('/api/auth', userRouters);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(
            process.env.USER_PORT,
            () => console.log(`Connected to database and Server running on port ${process.env.USER_PORT}`)
        )
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });