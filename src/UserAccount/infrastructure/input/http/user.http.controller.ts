import { routesV1 } from '@common/infrastructure/configs/app.routes';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUserRequestDto } from './dto/register-user.request.dto';
import { RegisterUserCommand } from 'src/UserAccount/application/use-cases/commands/register-user/register-user.command';
import { LoginUserCommand } from 'src/UserAccount/application/use-cases/commands/login-user/login-user.command';
import { LoginUserRequestDto } from './dto/login-user.request.dto';
import { TokenResponseDto } from './dto/token.response.dto';

@ApiTags(routesV1.userAccount.root)
@Controller({ version: routesV1.version })
export class UserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.userAccount.register)
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() payload: RegisterUserRequestDto) {
    return this.commandBus.execute(new RegisterUserCommand({ ...payload }));
  }

  @HttpCode(HttpStatus.OK)
  @Post(routesV1.userAccount.login)
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ type: TokenResponseDto })
  async login(@Body() payload: LoginUserRequestDto) {
    return {
      token: await this.commandBus.execute(
        new LoginUserCommand({ ...payload }),
      ),
    };
  }
}
