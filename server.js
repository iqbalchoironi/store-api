const express = require('express');
const app =  express();
const dotenv = require('dotenv');
dotenv.config();

const query = require('./src/db/query')


app.get('/', async (req, res) => {
    try {
        const newTodo = await query(
            "INSERT INTO users (username, email, password) VALUES($1,$2,$3) RETURNING *",
            ['test','test@test.com','test123']
        );
        res.json(newTodo.rows);
    } catch (err) {
        console.error(err.message);
    }
})

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