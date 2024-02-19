import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.users.create({
      data: {
        ...createUserDto,
        password: await hash(createUserDto.password, 10),
      },
    });
    const { password, ...user } = newUser;
    return {
      message: 'User created',
      data: user,
      statusCode: HttpStatus.CREATED,
    };
  }

  async findAll() {
    const allUsers = await this.prisma.users.findMany();
    return {
      message: 'ALl data users',
      data: allUsers,
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      message: `Data user id ${id}`,
      data: user,
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Data with ID ${id} not found`);
    }
    const updatedData = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });

    return {
      message: `Data user id ${id} was upated`,
      data: updatedData,
      statusCode: HttpStatus.OK,
    };
  }

  async remove(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Data with ID ${id} not found`);
    }
    const deletedData = await this.prisma.users.delete({
      where: { id },
    });

    return {
      message: `Data user id ${id} was deleted`,
      data: deletedData,
      statusCode: HttpStatus.OK,
    };
  }
}
