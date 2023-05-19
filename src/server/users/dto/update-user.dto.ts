import { PartialType } from '@nestjs/swagger';
import { CreateUserDto, createUserSchema } from './create-user.dto';

export const updateUserSchema = createUserSchema;

export class UpdateUserDto extends PartialType(CreateUserDto) {}
