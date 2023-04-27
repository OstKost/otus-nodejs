import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
import { PrismaService } from '../prisma/prisma.service';
import DataLoader from 'dataloader';
import { User } from '@prisma/client';

@Injectable()
export class UserLoader implements NestDataLoader<number, User> {
  constructor(private readonly prismaService: PrismaService) {}

  generateDataLoader(): DataLoader<number, User> {
    return new DataLoader<number, User>(async (userIds: number[]) => {
      const users = await this.prismaService.user.findMany({
        where: { id: { in: userIds } },
      });
      const usersMap = new Map(users.map((user) => [user.id, user]));
      return userIds.map((id) => usersMap.get(id));
    });
  }
}
