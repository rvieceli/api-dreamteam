import CreateUserService from '../../services/CreateUserService';
import UpdateUserService from '../../services/UpdateUserService';

class Controller {
  async store(request, response) {
    const { firstname, lastname, email, password } = request.body;

    await CreateUserService.run({
      firstname,
      lastname,
      email,
      password,
    });

    return response.json({
      message: 'Your account has been successfully created.',
    });
  }

  async update(request, response) {
    const { firstname, lastname, email } = request.body;

    await UpdateUserService.run(request.user, {
      firstname,
      lastname,
      email,
    });

    return response.json(request.user);
  }
}

export default new Controller();
