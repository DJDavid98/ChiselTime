import { getPasswordSchema } from './create-user.dto';
import Joi from 'joi';

export const updateUserSchema = Joi.object({
  password: getPasswordSchema(),
});

export class UpdateUserDto {
  password: string;
}
