const query = require ('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    addProductToCart: async (req, res) =>{

        const { qty, note, product_id } = req.body;
        const userId = req.user.id;
       
        try {
            
            //mengambil cart user melalui token
            let cart = await query(`SELECT * FROM cart WHERE user_id=$1`, [userId]);

            //mengecek apakah user memiliki cart ato tidak, jika tidak punya di buatkan cart
            if (cart.rows.length === 0) {
                cart = await query(`INSERT INTO cart(user_id) VALUES($1) returning *`,[userId]);
            }

            //mangambil detail cart untuk mengecek apakah produk sudah pernah masuk ke cart
            let detailCart = await query(
                `SELECT order_price, qty, note, product_id FROM detail_cart WHERE cart_id=$1 AND product_id=$2`,
                [cart.rows[0].id, product_id]
            );
            
            const productQuery = await query(
                `SELECT * FROM product WHERE id=$1`,
                [product_id]
            );

            //kolo produknya ada maka tinggal tambahkan qty nya
            if (detailCart.rows.length) {

                let newQty = parseInt(qty) +  parseInt(detailCart.rows[0].qty);
                let order_price = parseInt(productQuery.rows[0].price) * newQty;
                
                const { rows } = await query(
                    `UPDATE detail_cart SET qty = $1, order_price = $2
                     WHERE cart_id = $3 
                     AND product_id = $4 returning *`,
                    [newQty, order_price ,cart.rows[0].id, detailCart.rows[0].product_id]
                );

                res.send(rows);
            } else {
                //kolo ga ada insert baru ke cartnya
                let order_price = parseInt(productQuery.rows[0].price) * parseInt(qty);
                const { rows } = await query(
                    `INSERT INTO detail_cart(order_price, qty, note, product_id, cart_id) 
                     VALUES($1, $2, $3, $4, $5) returning *`, 
                    [order_price, qty, note, product_id, cart.rows[0].id]
                );

                res.send(rows);
            }

        } catch(error) {
            console.log(error)
        }

    },

    updateProductInCart: async (req, res) => {
        const { qty, note, product_id } = req.body;
        const userId = req.user.id;

        try {
            let cart = await query(`SELECT * FROM cart WHERE user_id=$1`, [userId]);
            const productQuery = await query(`SELECT * FROM product WHERE id=$1`, [product_id]);

            let order_price = parseInt(productQuery.rows[0].price) * qty;

            const { rows } = await query(
                `UPDATE detail_cart SET qty = $1, order_price = $2, note= $3
                 WHERE cart_id = $4 
                 AND product_id = $5 returning *`,
                [qty, order_price , note, cart.rows[0].id, product_id]
            );
            res.send(rows);
        } catch (error) {
            
        }
    },

    deleteProductInCart: async (req, res) => {
        const { product_id } = req.body;
        const userId = req.user.id;

        try {
            let cart = await query(`SELECT * FROM cart WHERE user_id=$1`, [userId]);

            const { rows } = await query(
                `DELETE FROM detail_cart
                 WHERE cart_id = $1 
                 AND product_id = $2 returning *`,
                [cart.rows[0].id, product_id]
            );

            res.send(rows);
        } catch (error) {
            console.log(error)
        }
    }
}