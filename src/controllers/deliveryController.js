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
    }
}