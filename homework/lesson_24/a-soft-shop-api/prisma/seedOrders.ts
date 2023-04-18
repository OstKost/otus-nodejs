import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedOrders(users, products) {
  console.log('Start seeding...');

  const ordersData = [
    {
      id: 1,
      price: 100,
      ownerId: 1,
    },
    {
      id: 2,
      price: 200,
      ownerId: 1,
    },
    {
      id: 3,
      price: 150,
      ownerId: 2,
    },
    {
      id: 4,
      price: 75,
      ownerId: 3,
    },
    {
      id: 5,
      price: 50,
      ownerId: 2,
    },
    {
      id: 6,
      price: 125,
      ownerId: 4,
    },
    {
      id: 7,
      price: 300,
      ownerId: 4,
    },
    {
      id: 8,
      price: 225,
      ownerId: 1,
    },
    {
      id: 9,
      price: 175,
      ownerId: 2,
    },
    {
      id: 10,
      price: 90,
      ownerId: 3,
    },
  ];

  for await (const orderData of ordersData) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const owner = await prisma.user.findUnique({ where: { id: randomProduct.ownerId } });
    let buyer;
    while (!buyer || owner.id === buyer?.id) {
      buyer = users[Math.floor(Math.random() * users.length)];
    }

    const order = await prisma.order.upsert({
      where: { productId: randomProduct.id },
      update: {},
      create: {
        ...orderData,
        productId: randomProduct.id,
        ownerId: owner.id,
        buyerId: buyer?.id,
      },
    });

    await prisma.product.update({
      where: { id: randomProduct.id },
      data: { orderId: order.id },
    });

    console.log(`Created order with product ID: ${order.productId}`);
  }

  console.log('Seeding finished.');
}
