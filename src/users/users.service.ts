import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.repo.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });
    const newUser = await this.repo.save(user);
    return { id: newUser.id };
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found!`);
    }

    return user;
  }

  async find(email: string) {
    return await this.repo.find({ where: { email } });
  }

  async update(id: string, attrs: Partial<UserEntity>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found!`);
    }

    Object.assign(user, attrs);
    const newUser = await this.repo.save(user);
    return { id: newUser.id };
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found!`);
    }

    return await this.repo.remove(user);
  }
}
