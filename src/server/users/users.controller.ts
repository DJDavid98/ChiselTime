import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { JoiValidationPipe } from '../joi-validation/joi-validation.pipe';
import { SessionUserGuard } from '../auth/guards/session-user.guard';
import { Request } from 'express';
import { UserInfoDto } from './dto/user-info.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(SessionUserGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UserInfoDto | null> {
    const user = id === 'me' ? req.user : await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return UserInfoDto.from(user);
  }

  @Patch(':id')
  @UseGuards(SessionUserGuard)
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    if (!req.user || user.id !== req.user.id) {
      throw new UnauthorizedException('You can only edit your own account');
    }
    return this.usersService.update(user, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(SessionUserGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    if (!req.user || user.id !== req.user.id) {
      throw new UnauthorizedException('You can only delete your own account');
    }
    return this.usersService.remove(user);
  }
}
