import Joi from 'joi';

export const USER_NAME_MAX_LENGTH = 50;
export const getUserNameSchema = () =>
  Joi.string().min(1).max(USER_NAME_MAX_LENGTH);

export const PASSWORD_MAX_LENGTH = 72;
export const getPasswordSchema = () =>
  Joi.string().min(8).max(PASSWORD_MAX_LENGTH);

export const createUserSchema = Joi.object({
  name: getUserNameSchema(),
  password: getPasswordSchema(),
});

export class CreateUserDto {
  name: string;
  password: string;
}
