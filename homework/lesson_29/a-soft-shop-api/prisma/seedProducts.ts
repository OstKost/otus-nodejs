import { PrismaClient, Product, User } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProducts(users: User[] = []): Promise<Product[]> {
  console.log('Start seeding products...');

  const productsData = [
    {
      id: 1,
      title: 'Product 1',
      content: 'This is product 1',
      price: 100,
    },
    {
      id: 2,
      title: 'Product 2',
      content: 'This is product 2',
      price: 200,
    },
    {
      id: 3,
      title: 'Product 3',
      content: 'This is product 3',
      price: 300,
    },
    {
      id: 4,
      title: 'Product 4',
      content: 'This is product 4',
      price: 400,
    },
    {
      id: 5,
      title: 'Product 5',
      content: 'This is product 5',
      price: 500,
    },
    {
      id: 6,
      title: 'Product 6',
      content: 'This is product 6',
      price: 600,
    },
    {
      id: 7,
      title: 'Product 7',
      content: 'This is product 7',
      price: 700,
    },
    {
      id: 8,
      title: 'Product 8',
      content: 'This is product 8',
      price: 800,
    },
    {
      id: 9,
      title: 'Product 9',
      content: 'This is product 9',
      price: 900,
    },
    {
      id: 10,
      title: 'Product 10',
      content: 'This is product 10',
      price: 1000,
    },
    {
      id: 11,
      title: 'Product 11',
      content: 'This is product 11',
      price: 1100,
    },
    {
      id: 12,
      title: 'Product 12',
      content: 'This is product 12',
      price: 1200,
    },
    {
      id: 13,
      title: 'Product 13',
      content: 'This is product 13',
      price: 1300,
    },
    {
      id: 14,
      title: 'Product 14',
      content: 'This is product 14',
      price: 1400,
    },
    {
      id: 15,
      title: 'Product 15',
      content: 'This is product 15',
      price: 1500,
    },
  ];

  for await (const productData of productsData) {
    const owner = users[Math.floor(Math.random() * users.length)];
    const sold = Number(Math.random().toFixed(1)) > 0.7;
    const published = Number(Math.random().toFixed(1)) > 0.2;
    const { id, ...restProductData } = productData;
    const product = await prisma.product.upsert({
      where: { id },
      update: {},
      create: {
        ...restProductData,
        ownerId: owner.id,
        sold,
        published: sold || published,
      },
    });
    console.log(`Created product with title: ${product.title}`);
  }

  console.log('Seeding products finished.');

  return await prisma.product.findMany();
}
