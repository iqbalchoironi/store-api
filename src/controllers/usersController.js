const query = require('../db/query');
const {hashPassword,comparePassword, generateUserToken} = require('../helpers/auth');
const {status, successMessage, errorMessage} = require('../helpers/payload')

module.exports = {
    userSignUp: async (req, res) => {

        const { first_name, last_name, password, email, telephone } = req.body;

        const hashedPassword = hashPassword(password);
        const createUserQuery = `INSERT INTO users(first_name, last_name, password, email, telephone)
                                 VALUES($1, $2, $3, $4, $5)
                                 returning *`;

        const values = [
            first_name, 
            last_name, 
            hashedPassword, 
            email, 
            telephone 
        ];

        try {
            const { rows } = await query(createUserQuery, values);
            const dbResponse = rows[0];

            delete dbResponse.password;
            delete dbResponse.active;
            delete dbResponse.create_at;
            delete dbResponse.update_at;
            delete dbResponse.last_login;
            
            const token = generateUserToken(dbResponse.id, dbResponse.first_name, dbResponse.last_name, dbResponse.email, dbResponse.telephone, dbResponse.role, dbResponse.verified);
            successMessage.data = dbResponse;
            successMessage.data.token = token;
            successMessage.message = 'succesfully created user';
            return res.status(status.created).send(successMessage);
        } catch (error) {
            if (error.routine === '_bt_check_unique') {
                errorMessage.message = 'User with that EMAIL already exist';
                return res.status(status.conflict).send(errorMessage);
            }
            errorMessage.message = 'Operation was not successful';
            return res.status(status.error).send(errorMessage);
        }

    },

    userSignIn: async(req, res) => {
        const { email, password} = req.body;
        const signinUserQuery = 'SELECT * FROM users WHERE email = $1';
        try {
            const { rows } = await query(signinUserQuery, [email]);
            const dbResponse = rows[0];
            
            if (!dbResponse) {
                errorMessage.message = 'User with this email does not exist';
                return res.status(status.notfound).send(errorMessage);
            }

            if (!comparePassword(dbResponse.password, password)) {
                errorMessage.message = 'The password you provided is incorrect';
                return res.status(status.bad).send(errorMessage);
            }

            delete dbResponse.password;
            delete dbResponse.active;
            delete dbResponse.create_at;
            delete dbResponse.update_at;
            delete dbResponse.last_login;

            const token = generateUserToken(dbResponse.id, dbResponse.first_name, dbResponse.last_name, dbResponse.email, dbResponse.telephone, dbResponse.role, dbResponse.verified);
            successMessage.data = dbResponse;
            successMessage.data.token = token;
            successMessage.message = 'user succesfully login';
            return res.status(status.created).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Operation was not successful';
            return res.status(status.error).send(errorMessage);
        }
    }
}