import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import { addHours } from 'date-fns';
import authConfig from '../../config/auth';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        externalId: Sequelize.UUID,
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        resetPasswordToken: Sequelize.UUID,
        resetPasswordExpires: Sequelize.DATE,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    this.addHook('beforeCreate', async user => {
      user.externalId = uuid();
    });

    return this;
  }

  static findByEmail(email) {
    return this.findOne({ where: { email } });
  }

  static findByExternalId(externalId) {
    return this.findOne({ where: { externalId } });
  }

  get name() {
    return `${this.firstname} ${this.lastname}`;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  generateForgotPasswordToken() {
    return this.update({
      resetPasswordToken: uuid(),
      resetPasswordExpires: addHours(new Date(), 1),
    });
  }

  resetPassword(password) {
    return this.update({
      password,
      externalId: uuid(),
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  generateToken() {
    return jwt.sign(
      {
        id: this.externalId,
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      }
    );
  }

  // TODO: review this to serialize better
  // https://medium.com/riipen-engineering/serializing-data-with-sequelize-6c3a9633797a
  toJSON() {
    const { externalId, firstname, lastname, email } = this;

    return {
      id: externalId,
      firstname,
      lastname,
      email,
    };
  }
}

export default User;
