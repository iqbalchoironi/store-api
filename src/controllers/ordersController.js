const {query, isolateClientPool} = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    makeOrders: async (req, res) => {
        let { 
            address_id, 
            delivery_fee,
            payment_method_id,
            delivery_method_id,
            detail_orders
        } = req.body;

        const userId = req.user.id;

        const client = await isolateClientPool();

        try {
            detail_orders = await Promise.all( detail_orders.map( async (itm, index) => {
                let product = await client.query(
                    `SELECT price FROM product WHERE id=$1`
                    ,[itm.product_id]
                );
                itm.order_price = itm.qty * product.rows[0].price;
                return itm;
            }))
            
            let totalPrice = detail_orders.reduce((total,itm) => {
                return total + parseInt(itm.order_price);
            }, 0);
            
            let payment_value = totalPrice + parseInt(delivery_fee);

            await client.query('BEGIN');

            const ordersQuery = await client.query(
                `INSERT INTO orders(total_order_price, delivery_fee, user_id, address_id, delivery_method_id)
                 VALUES($1,$2,$3,$4,$5) returning*`
                ,[totalPrice,  parseInt(delivery_fee), userId, address_id, delivery_method_id]
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
    },

    getOrdersById: async (req, res) => {

        const ordersId = req.params.id;

        try {
            let orders = await query(
                `SELECT orders.id, orders.status, orders.total_order_price, orders.delivery_fee, 
                    address.alamat, address.kelurahan, address.kota, address.provinsi,
                    delivery_method.name AS delivery_method,
                    payment_method.name AS payment_method_name, payment_method.provider AS payment_method_provider 
                 FROM orders
                 INNER JOIN address ON orders.address_id = address.id
                 INNER JOIN delivery_method ON orders.delivery_method_id = delivery_method.id
                 INNER JOIN payment ON orders.id = payment.orders_id
                 INNER JOIN payment_method ON payment.payment_method_id = payment_method.id
                 WHERE orders.id = $1`,
                [ordersId]
            );
            let ordersDetail = await query(
                `SELECT detail_orders.order_price, detail_orders.qty, detail_orders.note, 
                    product.name, product.price, 
                    product_category.name
                 FROM detail_orders
                 INNER JOIN product ON detail_orders.product_id = product.id
                 INNER JOIN product_category ON product.product_category_id = product_category.id
                 WHERE detail_orders.orders_id = $1`,
                [ordersId]
            );
            
            orders = orders.rows[0];
            orders.delivery_method = orders.name;
            delete orders.name;
            orders.detail_orders = ordersDetail.rows;

            res.send(orders);

        } catch(error) {

        }
    }
}