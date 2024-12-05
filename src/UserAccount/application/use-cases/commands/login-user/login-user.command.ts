import { Command, CommandProps } from '@common/application/command.base';

export class LoginUserCommand extends Command {
  readonly email: string;
  readonly password: string;

  constructor(props: CommandProps<LoginUserCommand>) {
    super(props);

    this.email = props.email;
    this.password = props.password;
  }
}
