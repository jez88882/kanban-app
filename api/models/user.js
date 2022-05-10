const { DataTypes } = require('sequelize');
const argon = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = function(sequelize) {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is:/(?=.*\d)(?=.*[a-zA-Z])(?=.*\W).{8,10}/
      }
    },
    is_disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    resetPasswordToken: {
      type: DataTypes.TEXT
    },
    resetPasswordExpire: {
      type: DataTypes.DATE
    }
  }, {
    defaultScope: { attributes: { exclude: ['password'] }},
    tableName: 'accounts'
  });

  User.beforeSave(async function(user, options) {
    const hashedPassword = await argon.hash(user.password);
    user.password = hashedPassword;
  });

  // Return JSON Web Token
  User.prototype.getJwt = function() {
    return jwt.sign({ username: this.username}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME
    });
  };

  // check if submitted password is correct
  User.prototype.checkPassword = async function(submittedPassword) {
    return await argon.verify( this.password ,submittedPassword);
  }

  // generate password reset token
  User.prototype.getResetPasswordToken = function() {
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash and set resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256')
                                .update(resetToken)
                                .digest('hex');
    // set token expire time
    this.resetPasswordExpire = Date.now() + 30*60*1000;
    return resetToken
  }
  return User;
}
