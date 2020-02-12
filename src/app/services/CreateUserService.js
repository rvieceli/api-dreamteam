import User from '../models/User';
import { ValidationError } from '../../lib/errors';

class CreateUserService {
  async run({ email, firstname, lastname, password }) {
    const exist = await User.findByEmail(email);

    if (exist) {
      throw new ValidationError('User already exists');
    }

    const user = await User.create({
      email,
      firstname,
      lastname,
      password,
    });

    return user;
  }
}

export default new CreateUserService();
