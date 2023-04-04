var mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;


const userSchema = new Schema({
    userName: { type: String, unique: true },
    password: String,
    email: String,
    loginHistory: [{
      dateTime: Date,
      userAgent: String
    }]
  });

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        const db = mongoose.connection;
        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
        mongoose.connect("mongodb+srv://henriquesagara:rzJVd2mOKaQJB08g@senecaweb.6aancfa.mongodb.net/users?retryWrites=true&w=majority");
    });
};


module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(userData.password, 10)
        .then(hash => {
          const newUser = new User({
            userName: userData.userName,
            password: hash,
            email: userData.email
          });
          newUser.save()
            .then(() => resolve())
            .catch(err => reject(`There was an error saving the user to the database: ${err}`));
        })
        .catch(err => reject(`There was an error encrypting the password: ${err}`));
    });
  }
  
  module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
      User.findOne({ userName: userData.userName })
        .exec()
        .then(user => {
          if (!user) {
            reject(`Unable to find user: ${userData.userName}`);
          } else {
            bcrypt.compare(userData.password, user.password)
              .then(result => {
                if (result) {
                  resolve(user);
                } else {
                  reject(`Incorrect password for user: ${userData.userName}`);
                }
              })
              .catch(err => reject(`There was an error comparing the passwords: ${err}`));
          }
        })
        .catch(err => reject(`There was an error finding the user: ${err}`));
    });
  }
  
