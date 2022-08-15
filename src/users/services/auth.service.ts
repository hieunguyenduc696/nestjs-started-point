import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto, SignInUserDto } from '../dto';
import { UsersService } from '../users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(createUserDto: CreateUserDto) {
    const users = await this.usersService.find(createUserDto.email);

    if (users.length) {
      throw new BadRequestException('User already exists!');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(createUserDto.password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const newUser: CreateUserDto = {
      email: createUserDto.email,
      password: result,
    };

    const user = await this.usersService.create(newUser);

    return user;
  }

  async signin(signInUserDto: SignInUserDto) {
    const [user] = await this.usersService.find(signInUserDto.email);

    if (!user) {
      throw new NotFoundException(
        `User with email: ${signInUserDto.email} not found!`,
      );
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(signInUserDto.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }

    return user;
  }
}
