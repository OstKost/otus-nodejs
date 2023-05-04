import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('Seeding users...');

  const usersData = [
    {
      name: 'Admin',
      email: 'admin@example.com',
      phone: '+0 000 000 0000',
      password: 'admin123',
      role: Role.admin,
    },
    {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+1 123 456 7890',
      password: 'password123',
    },
    {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '+1 234 567 8901',
      password: 'password456',
    },
    {
      name: 'Bob Johnson',
      email: 'bobjohnson@example.com',
      phone: '+1 345 678 9012',
      password: 'password789',
    },
    {
      name: 'Alice Williams',
      email: 'alicewilliams@example.com',
      phone: '+1 456 789 0123',
      password: 'passwordabc',
    },
    {
      name: 'Mike Brown',
      email: 'mikebrown@example.com',
      phone: '+1 567 890 1234',
      password: 'passworddef',
    },
  ];

  for await (const userData of usersData) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(userData.password, saltOrRounds);
    userData.password = hash;
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`Created user with email: ${user.email}`);
  }

  console.log('Users seeding finished.');

  return await prisma.user.findMany();
}
