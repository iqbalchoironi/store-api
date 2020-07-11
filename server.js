const express = require('express');
const app =  express();
const dotenv = require('dotenv');
dotenv.config();

const usersRoute = require('./src/routes/usersRoute');

app.use(express.json())
app.use(express.urlencoded());

// routes
app.use('/api/v1', usersRoute);

// Unmatched routes handler
app.use((req, res) => {
    if(req.method.toLowerCase() === 'options') {
        res.end();
    } else {
        res.status(404).type('txt').send('Not Found');
    }
})

let listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`App runing on PORT ${listener.address().port}`)
})