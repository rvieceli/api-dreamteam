import * as Yup from 'yup';
import { ValidationError } from '../../lib/errors';

export default async (request, response, next) => {
  try {
    const schema = Yup.object().shape({
      firstname: Yup.string(),
      lastname: Yup.string(),
      email: Yup.string().email(),
    });

    await schema.validate(request.body, { abortEarly: false });

    return next();
  } catch (err) {
    throw new ValidationError(null, err.inner);
  }
};
