import { Command, CommandProps } from '@common/application/command.base';

export class RenameNotebookCommand extends Command {
  readonly notebookId: string;
  readonly newName: string;
  readonly userId: string;

  constructor(props: CommandProps<RenameNotebookCommand>) {
    super(props);

    this.notebookId = props.notebookId;
    this.newName = props.newName;
    this.userId = props.userId;
  }
}
