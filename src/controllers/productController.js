const {query} =  require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    addProductCategory: async (req, res) => {
        
        const { name } = req.body;
        try {
            const { rows } = await query(
                `INSERT INTO product_category(name) VALUES($1) returning *`, 
                [name]
            );
            const dbResponse = rows[0];
            console.log(dbResponse)
            delete dbResponse.create_at;
            delete dbResponse.update_at;

            successMessage.data = dbResponse;
            successMessage.message = 'succesfully created product category';
            return res.status(status.created).send(successMessage);
        } catch(error) {
            console.log(error);
        }
    },

    productCategoryList: async (req, res) => {
        try {
            const { rows } = await query(
                `SELECT * FROM product_category`
            )
            res.send(rows);
        } catch(error) {

        }
    },

    addProduct: async (req, res) => {

        const { name, description, stock, price, product_category_id } = req.body;

        try {
            const { rows } = await query(
                `INSERT INTO product(name,description,stock,price,product_category_id) 
                 VALUES($1, $2, $3, $4, $5)
                 returning *`, 
                [name,description,stock,price,product_category_id]
            )

            const dbResponse = rows[0];

            delete dbResponse.create_at;
            delete dbResponse.update_at;

            successMessage.data = dbResponse;
            successMessage.message = 'succesfully created product';
            return res.status(status.created).send(successMessage);
        } catch(error) {
            console.log(error);
        }
    },

    getProductPerPage: async (req, res) => {
        let page = req.params.page || 1;
        let productPerPage = 10;

        let startFrom = page * productPerPage - productPerPage; 
        try {
            const { rows } = await query(
                `SELECT * FROM product LIMIT $1 OFFSET $2`,
                [productPerPage, startFrom]
            )
            res.send(rows);
        } catch(error){

        }
    },

    getProductById: async (req, res) => {
        let productId = req.params.id;
        try {
            const { rows } = await query(
                `SELECT * FROM product WHERE id=$1`,
                [productId]
            )
            res.send(rows[0]);
        } catch(error){

        }
    },

    searchProduct: async (req, res) => {
        let productPerPage = 10;
        let page = req.params.page || 1;
        let key = req.params.key;

        let startFrom = page * productPerPage - productPerPage; 
        try {
            const { rows } = await query(
                `SELECT * FROM product WHERE name LIKE $1 LIMIT $2 OFFSET $3`,
                [`%${key}%`,productPerPage, startFrom]
            )
            res.send(rows);
        } catch(error){

        }
    },

    suggestionSearchProduct: async (req, res) => {
        let suggestionLimit = 10;
        let key = req.params.key;

        try {
            const { rows } = await query(
                `SELECT name FROM product WHERE name LIKE $1 LIMIT $2`,
                [`%${key}%`, suggestionLimit]
            )
            res.send(rows);
        } catch(error){

        }
    },

    addProductRiview: async(req, res) => {
        const { rate, field, product_id, orders_id } = req.body;
        const userId = req.user.id;

        try {

            const orders = await query(
                `SELECT * FROM orders WHERE id=$1`,
                [orders_id]
            );

            if (orders.rows[0].user_id !== userId || orders.rows[0].status !== 'diterima') {
                res.status(status.bad).send(errorMessage);
            }
            const { rows } = await query(
                `INSERT INTO product_riview(rate,field,product_id,orders_id)
                 VALUES($1,$2,$3,$4)`
                [rate, field, product_id, orders_id]
            );

            res.status(status.created).send(rows[0]);

        } catch(error) {

        }
    }
}