import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { JoiValidationPipe } from '../joi-validation/joi-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
