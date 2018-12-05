const UserModel = require('../models/user');

exports.createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    try {
      const newUser = UserModel({
        email: email,
        password: password,
      });

      newUser.save(err => {
        if (err) {
          reject(err);
        } else {
          resolve(newUser);
        }
      });
    } catch (ex) {
      reject(ex);
    }
  });
};
