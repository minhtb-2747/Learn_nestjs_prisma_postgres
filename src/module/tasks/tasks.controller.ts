import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from 'src/dto/task.dto';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTasks(@Body() data: CreateTaskDto, @Req() req: any): Promise<any> {
    return this.tasksService.createTasks(data);
  }

  @Get()
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  getTasks(@Query() query: any, @Req() req: any): Promise<any> {
    console.log('user_getTask', req?.user);
    return this.tasksService.getTasks(query);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.tasksService.deleteTask(id);
  }

  @Patch('/:id')
  updateTask(
    @Body() data: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.tasksService.updateTask(data, id);
  }
}
