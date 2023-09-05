import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getTasks(filterDto: FilterTasksDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async findById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id, user });
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async delete(id: string, user: User): Promise<boolean> {
    const task = await this.findById(id, user);
    if (!task) {
      return false;
    }

    await this.tasksRepository.remove(task);

    return true;
  }

  async updateStatus(
    id: string,
    newStatus: TaskStatus,
    user: User,
  ): Promise<Task | null> {
    const task = await this.findById(id, user);
    if (!task) {
      return null;
    }
    task.status = newStatus;
    this.tasksRepository.save(task);
    return task;
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.tasksRepository.save(task);
    return task;
  }
}
