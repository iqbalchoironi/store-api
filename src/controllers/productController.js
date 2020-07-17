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
        
        //untuk filter
        let name = req.query.name;
        let min_price = req.query.min_price;
        let max_price = req.query.max_price;
        let product_category = req.query.product_category;

        //untuk pagination
        let skip = req.query.skip;
        let limit = req.query.limit;

        //untuk sort
        let sort_by = req.query.sort_by;
        let sort_type = req.query.sort_type;

        let sql = `
            SELECT 
                product.id,
                product.name,
                product.description,
                product.stock,
                product.price,
                product_category.name category_name
            FROM
                product
            LEFT JOIN
                product_category
                    ON product.product_category_id = product_category.id
            WHERE product.stock > 0
                ${name ? ` AND product.name LIKE '%${name}%'` : ''}
                ${min_price ? ` AND product.price >= ${min_price}` : ''}
                ${max_price ? ` AND product.price <= ${max_price}` : ''}
                ${product_category ? ` AND product_category.name LIKE '%${product_category}%'` : ''}
            ${sort_by ? ` ORDER BY ${sort_by} ${sort_type ? sort_type : ' ASC'}` : ''}
            ${limit ? ` LIMIT ${limit}` : ''}
            ${skip ? ` OFFSET ${skip}` : ''}
        `
        try {
            let { rows } = await query(sql);
            successMessage.message = 'Readed filtered product';
            successMessage.data = rows;
            res.status(status.success).send(successMessage);
        } catch(error){
            errorMessage.message = 'Error when get product with filter';
            errorMessage.error = error.error;
            res.status(status.error).send(errorMessage);
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
            
            if (orders.rows[0].user_id !== userId) {
                res.status(status.bad).send(errorMessage);
            }
            const { rows } = await query(
                `INSERT INTO product_riview(rate,field,product_id,orders_id)
                 VALUES($1,$2,$3,$4) returning *`,
                [rate, field, product_id, orders_id]
            );

            res.status(status.created).send(rows[0]);

        } catch(error) {
            console.log(error)
        }
    }
}