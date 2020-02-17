import { ValidationError } from '../../lib/errors';

class UpdateUserService {
  async run(user, { email, firstname, lastname }) {
    if (email && user.email !== email) {
      throw new ValidationError('New email already exists');
    }

    await user.update({
      email,
      firstname,
      lastname,
    });

    return user;
  }
}

export default new UpdateUserService();
