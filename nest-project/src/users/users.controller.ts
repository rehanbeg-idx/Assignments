import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  Session,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUsersDto } from './dtos/create-users.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { Users } from './users.entity';
import { AuthGuard } from 'src/gurads/auth.guard';

@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoAmI')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: Users) {
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUsersDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async loginUser(@Body() body: CreateUsersDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Serialize(UsersDto)
  @Get('/id/:id')
  findUser(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get('/email/:email')
  find(@Param('email') email: string) {
    return this.usersService.find(email);
  }

  @Serialize(UsersDto)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() body: CreateUsersDto) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
