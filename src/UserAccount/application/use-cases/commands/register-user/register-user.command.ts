import { Command, CommandProps } from '@common/application/command.base';

export class RegisterUserCommand extends Command {
  readonly name: string;
  readonly email: string;
  readonly password: string;

  constructor(props: CommandProps<RegisterUserCommand>) {
    super(props);

    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
  }
}
