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

            //mangambit detail cart untuk mengecek apakah produk sudah pernah masuk ke cart
            let detailCart = await query(
                `SELECT dc.order_price, dc.qty, dc.note, dc.product_id FROM detail_cart AS dc INNER JOIN 
                cart AS c ON dc.cart_id = c.id WHERE c.id=$1`,[cart.rows[0].id]
            );
            
            //mengecek produk
            let checkProduct = detailCart.rows.filter(itm => {
                return itm.product_id === product_id
            })

            //kolo produknya ada maka tinggal tambahkan qty nya
            if (checkProduct.length) {
                const productQuery = await query(
                    `SELECT * FROM product WHERE id=$1`,
                    [checkProduct[0].product_id]
                )
                let newQty = parseInt(qty) +  parseInt(checkProduct[0].qty);
                let order_price = parseInt(productQuery.rows[0].price) * newQty;
                
                const { rows } = await query(
                    `UPDATE detail_cart SET qty = $1, order_price = $2
                     WHERE cart_id = $3 
                     AND product_id = $4 returning *`,
                [ newQty, order_price ,cart.rows[0].id, checkProduct[0].product_id]);
                res.send(rows);
            } else {
                //kolo ga ada insert baru ke cartnya
                const productQuery = await query(
                    `SELECT * FROM product WHERE id=$1`,
                    [product_id]
                )
                let order_price = parseInt(productQuery.rows[0].price) * parseInt(qty);
                const { rows } = await query(
                    `INSERT INTO detail_cart(order_price, qty, note, product_id, cart_id) 
                    VALUES($1, $2, $3, $4, $5) returning *`, 
                [order_price, qty, note, product_id, cart.rows[0].id]);
                res.send(rows);
            }

        } catch(error) {
            console.log(error)
        }

    },
}