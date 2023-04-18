import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  userFields = {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  };

  create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.prisma.product.create({
      data: {
        title: createProductDto.title,
        content: createProductDto.content,
        price: createProductDto.price,
        owner: { connect: { id: createProductDto.ownerId } },
      },
      include: { owner: this.userFields, order: true },
    });
  }

  findAll(): Promise<ProductEntity[]> {
    return this.prisma.product.findMany({
      include: {
        owner: this.userFields,
        order: true,
      },
    });
  }

  findOne(id: number): Promise<ProductEntity> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { owner: this.userFields, order: true },
    });
  }

  update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.prisma.product.update({
      where: { id },
      data: {
        title: updateProductDto.title,
        content: updateProductDto.content,
        price: updateProductDto.price,
        published: updateProductDto.published,
        sold: updateProductDto.sold,
        owner: { connect: { id: updateProductDto.ownerId } },
        order: { connect: { id: updateProductDto.orderId } },
      },
      include: { owner: this.userFields, order: true },
    });
  }

  remove(id: number): Promise<ProductEntity> {
    return this.prisma.product.delete({
      where: { id },
      include: { owner: this.userFields, order: true },
    });
  }
}
