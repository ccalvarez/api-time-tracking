const bcrypt = require('bcryptjs');

const UserModel = require('../models/user');

exports.createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.hash(password, 12).then(hashedPassword => {
        const newUser = UserModel({
          email: email,
          password: hashedPassword,
        });

        newUser.save(err => {
          if (err) {
            reject(err);
          } else {
            resolve(newUser);
          }
        });
      });
    } catch (ex) {
      reject(ex);
    }
  });
};
