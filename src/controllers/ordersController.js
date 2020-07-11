const query = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    makeOrders: async (req, res) => {
        const { address_id, delivery_fee, detail_orders} = req.body;
        const userId = req.user.id;

        let totalPrice = detail_orders.reduce((total,itm) => {
            console.log(itm)
            return total + parseInt(itm.order_price);
        }, 0);
        try {
            const ordersQuery = await query(
                `INSERT INTO orders(total_order_price, delivery_fee, user_id, address_id)
                 VALUES($1,$2,$3,$4) returning*`
                ,[totalPrice, delivery_fee, userId, address_id]
            );

            detail_orders.forEach( async itm => {
                await query(
                    `INSERT INTO detail_orders(order_price, qty, note, orders_id, product_id)
                     VALUES($1,$2,$3,$4,$5)`
                    ,[itm.order_price,itm.qty,itm.note,ordersQuery.rows[0].id,itm.product_id]
                );
            });

            res.status(status.created).send(successMessage);
        } catch(error) {
            console.log(error);
        }
    },

    cancelOrders: async (req, res) => {
        const { orders_id } = req.body;
        const userId = req.user.id;

        try {
            const ordersQuery = await query(
                `SELECT * FROM orders WHERE id=$1`,
                [orders_id]
            )

            if (ordersQuery.rows[0].user_id !== userId) {

            } else {
                const destroyOrders = query(
                    `DELETE FROM orders WHERE id=$1 returning *`,
                    [orders_id]
                );

                res.send(destroyOrders.rows);
            }
        } catch(error) {
            console.log(error);
        }
    }
}