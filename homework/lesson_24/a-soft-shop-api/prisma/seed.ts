import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seedUsers';
import { seedProducts } from './seedProducts';
import { seedOrders } from './seedOrders';

const prisma = new PrismaClient();

async function main() {
  const users = await seedUsers();
  const products = await seedProducts(users);
  await seedOrders(users, products);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
