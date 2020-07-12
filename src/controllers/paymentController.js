const query = require('../db/query');
const { status } = require('../helpers/payload');

module.exports = {
    addPaymentMethod: async (req, res) => {
        const { name, transfer_code, provider, description } = req.body;
        const { rows } = await query(
            `INSERT INTO payment_method(name, transfer_code, provider, description)
             VALUES($1,$2,$3,$4) returning*`,
            [name, transfer_code, provider,description]
        );
        return res.send(rows)
    },


}