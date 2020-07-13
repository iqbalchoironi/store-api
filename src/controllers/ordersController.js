const {query, isolateClientPool} = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    makeOrders: async (req, res) => {
        const { 
            address_id, 
            delivery_fee,
            payment_method_id,
            delivery_method_id,
            detail_orders
        } = req.body;

        const userId = req.user.id;

        const client = await isolateClientPool();
        let totalPrice = detail_orders.reduce((total,itm) => {
            return total + parseInt(itm.order_price) * parseInt(itm.qty);
        }, 0);

        let payment_value = totalPrice + parseInt(delivery_fee);

        try {

            await client.query('BEGIN');

            const ordersQuery = await client.query(
                `INSERT INTO orders(total_order_price, delivery_fee, user_id, address_id, delivery_method_id)
                 VALUES($1,$2,$3,$4,$5) returning*`
                ,[totalPrice, delivery_fee, userId, address_id, delivery_method_id]
            );
            
            detail_orders.forEach( async itm => {
                await client.query(
                    `INSERT INTO detail_orders(order_price, qty, note, orders_id, product_id)
                     VALUES($1,$2,$3,$4,$5)`
                    ,[itm.order_price,itm.qty,itm.note,ordersQuery.rows[0].id,itm.product_id]
                );
            });

            await client.query(
                `INSERT INTO payment(orders_id,payment_value,payment_method_id)
                 VALUES($1,$2,$3)`
                ,[ordersQuery.rows[0].id, payment_value,payment_method_id]
            );

            await client.query('COMMIT');
            
            successMessage.message = 'success create your orders';
            res.status(status.created).send(successMessage);
        } catch(error) {
            await client.query('ROLLBACK');
            res.status(status.error).send(errorMessage);
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