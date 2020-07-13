const {query} =  require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    addProductCategory: async (req, res) => {
        
        const { name } = req.body;
        const createProductCategoryQuery = `INSERT INTO product_category(name) 
                                    VALUES($1)
                                    returning *`;
        const values = [
            name
        ];

        try {
            const { rows } = await query(createProductCategoryQuery, values);
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
    addProduct: async (req, res) => {

        const { name, description, stock, price, product_category_id } = req.body;
        const createProductQuery = `INSERT INTO product(name,description,stock,price,product_category_id) 
                                    VALUES($1, $2, $3, $4, $5)
                                    returning *`;
        const values = [
            name,
            description,
            stock,
            price,
            product_category_id
        ];

        try {
            const { rows } = await query(createProductQuery, values);
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
    }
}