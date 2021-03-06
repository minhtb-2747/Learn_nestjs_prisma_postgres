import { Injectable, NotFoundException } from '@nestjs/common';

import { User, Task, Prisma } from '.prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTaskDto } from 'src/dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create task
   * @param data Thông tin bao gồm name, description, owner
   * @returns Dữ liệu vừa thêm
   */
  async createTasks(data: CreateTaskDto): Promise<any> {
    if (data) {
      // Trường hợp data dạng mảng (ví dụ import task)
      if (Array.isArray(data)) {
        const tasks = await this.prisma.task.createMany({ data });
        return tasks; // return so luong task add
      } else {
        // Trường hợp tạo 1 task
        let dataSave = {};

        if (!data?.name) throw new NotFoundException('Task name is required');
        if (data?.description)
          dataSave = {
            ...dataSave,
            description: data.description,
          };

        if (data?.ownerId)
          dataSave = {
            ...dataSave,
            owner: {
              connect: {
                id: data.ownerId,
              },
            },
          };
        console.log('dataSave', dataSave);

        return await this.prisma.task.create({
          data: {
            name: data.name,
            ...dataSave,
          },
        });
      }
    } else {
      throw new NotFoundException('Data task not found');
    }
  }

  async getTasks(query: any): Promise<any> {
    const { name, description } = query;

    return await this.prisma.task.findMany({
      // skip:  pagination
      // take:
      // find field relations
      select: {
        owner: true,
        id: true,
        name: true,
        description: true,
      },
      // where: {
      //     body: {
      //         search: name||"",
      //     },
      // },
    });
  }

  async deleteTask(id: number): Promise<any> {
    if (!id) throw new NotFoundException('Task id not empty');
    else {
      const getTask = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!getTask) {
        throw new NotFoundException('Record to delete does not exist.');
      } else {
        return await this.prisma.task.delete({
          where: {
            id,
          },
        });
      }
    }
  }

  async updateTask(data: any, id: number): Promise<any> {
    if (!id) throw new NotFoundException('Task id not empty');
    else {
      const getTask = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      console.log('getTAs', getTask);

      if (!getTask) {
        throw new NotFoundException('Record to update does not exist.');
      } else {
        return await this.prisma.task.update({
          where: {
            id,
          },
          data,
        });
      }
    }
  }
}
