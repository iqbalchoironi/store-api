const query = require('../db/query');
const { status } = require('../helpers/payload');

module.exports = {
    addDeliveryMethod: async (req, res) => {
        const { name, decsription } = req.body;
        const { rows } = query(
            `INSERT INTO payment_method(name, decription)
             VALUES($1,$2)`,
            [name, decsription]
        );
    }
}