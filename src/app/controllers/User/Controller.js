import CreateUserService from '../../services/CreateUserService';

class Controller {
  async store(request, response) {
    const { firstname, lastname, email, password, endpoint } = request.body;

    await CreateUserService.run({
      firstname,
      lastname,
      email,
      password,
      endpoint,
    });

    return response.json({
      message: 'Your account has been successfully created.',
    });
  }
}

export default new Controller();
