const {query} = require('../db/query');
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

    getPaymentMethodList: async (req, res) => {
        try {
            const { rows } = await query(
                `SELECT * FROM payment_method`
            )
            res.send(rows);
        }catch(error) {
            
        }
    },

    getPaymentOrders: async (req, res) => {
        let ordersId = req.params.id;
        try {
            const { rows } = await query(
                `SELECT payment.payment_value, payment.status, payment_method.name, payment_method.transfer_code,payment_method.provider,payment_method.id
                 FROM payment
                 INNER JOIN payment_method ON payment.payment_method_id = payment_method.id
                 WHERE payment.orders_id =$1`,
                [ordersId]
            )
            rows[0].payment_method_id = rows[0].id;
            delete rows[0].id;
            res.send(rows[0]);
        }catch(error) {
            
        }
    },

    getDetailPaymentMethod: async (req, res) => {
        let paymentMethodId = req.params.id;
        try {
            const { rows } = await query(
                `SELECT * FROM payment_method WHERE id=$1`,
                [paymentMethodId]
            )
            res.send(rows[0]);
        }catch(error) {
            
        }
    }


}