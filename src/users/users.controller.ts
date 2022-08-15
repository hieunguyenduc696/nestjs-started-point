import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CurrentUser, Serialize } from 'common';
import { CreateUserDto, SignInUserDto, UpdateUserDto, UserDto } from './dto';
import { AuthService } from './services';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('/signup')
  @HttpCode(201)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ) {
    try {
      const userId = await this.authService.signup(createUserDto);
      session.userId = userId;

      return userId;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/signin')
  async signIn(@Body() signInUserDto: SignInUserDto, @Session() session: any) {
    try {
      const user = await this.authService.signin(signInUserDto);
      session.userId = user.id;

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    try {
      return await this.usersService.find(email);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
