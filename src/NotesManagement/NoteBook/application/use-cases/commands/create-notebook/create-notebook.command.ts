import { Command, CommandProps } from '@common/application/command.base';

export class CreateNotebookCommand extends Command {
  readonly name: string;
  readonly userId: string;

  constructor(props: CommandProps<CreateNotebookCommand>) {
    super(props);

    this.name = props.name;
    this.userId = props.userId;
  }
}
