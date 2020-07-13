const {query} = require('../db/query');
const { status } = require('../helpers/payload');

module.exports = {
    addDeliveryMethod: async (req, res) => {
        const { name, description } = req.body;
        const { rows } = await query(
            `INSERT INTO delivery_method(name, description)
             VALUES($1,$2) returning*`,
            [name, description]
        );
        res.send(rows);
    },

    getDeliveryMethod: async (req, res) => {
        try {
            const { rows } = await query(
                `SELECT * FROM delivery_method`
            )
            res.send(rows);
        }catch(error) {
            
        }
    }
}