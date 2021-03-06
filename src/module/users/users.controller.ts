import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService) {}

  @Post()
  createUser(@Body() data: any): Promise<any> {
    return this.userServices.createUser(data);
  }

  @Get()
  getUsers(): Promise<any> {
    return this.userServices.getUsers();
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.userServices.deleteUser(id);
  }
}
