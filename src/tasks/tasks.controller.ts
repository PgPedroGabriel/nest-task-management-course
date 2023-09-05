import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: FilterTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  async findById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task | NotFoundException> {
    const task = await this.tasksService.findById(id, user);
    return task || new NotFoundException(`Task with "${id}" not found`);
  }

  @Delete('/:id')
  async deleteById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<true | BadRequestException> {
    const deleted = await this.tasksService.delete(id, user);
    return deleted || new BadRequestException();
  }

  @Patch('/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() newStatusBody: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task | NotFoundException> {
    const task = await this.tasksService.updateStatus(
      id,
      newStatusBody.status,
      user,
    );
    return task || new NotFoundException(`Task with "${id}" not found`);
  }

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.create(createTaskDto, user);
  }
}
