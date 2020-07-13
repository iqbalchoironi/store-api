const pool = require("./pool");

const isolateClientPool = () => {
    return pool.connect();
}

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        client.query(sql, params)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            })
    });
}

module.exports = {isolateClientPool, query};