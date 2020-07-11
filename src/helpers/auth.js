const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

const comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
};

const generateUserToken = (id, first_name, last_name, email, telephone, role, verified) => {
  const token = jwt.sign({
      user_id: id,
      first_name,
      last_name,
      email,
      telephone,
      role,
      verified
    },
    process.env.SECRET, { expiresIn: '3d' });
    return token;
};

module.exports = { hashPassword ,comparePassword, generateUserToken };
  