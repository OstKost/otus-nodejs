import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async updateUser(id: number, data: UpdateUserInput): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
