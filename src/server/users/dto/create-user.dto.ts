import Joi from 'joi';

export const USER_NAME_MAX_LENGTH = 50;
export const getUserNameSchema = () =>
  Joi.string().min(1).max(USER_NAME_MAX_LENGTH);

export const createUserSchema = Joi.object({
  name: getUserNameSchema(),
});

export class CreateUserDto {
  name: string;
}
