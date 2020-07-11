const express = require('express');
const app =  express();
const dotenv = require('dotenv');
dotenv.config();

const usersRoute = require('./src/routes/usersRoute');
const productRoute = require('./src/routes/productRoute');
const cartRoute = require('./src/routes/cartRoute');
const ordersRoute = require('./src/routes/ordersRoute');

app.use(express.json())
app.use(express.urlencoded());

// routes
app.use('/api/v1', usersRoute);
app.use('/api/v1', productRoute);
app.use('/api/v1', cartRoute);
app.use('/api/v1', ordersRoute);

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