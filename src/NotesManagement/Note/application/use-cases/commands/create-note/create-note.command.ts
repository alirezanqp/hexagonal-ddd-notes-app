import { Command, CommandProps } from '@common/application/command.base';

export class CreateNoteCommand extends Command {
  readonly title: string;
  readonly content?: string;
  readonly tags?: string[];
  readonly notebookId?: string;
  readonly userId: string;

  constructor(props: CommandProps<CreateNoteCommand>) {
    super(props);

    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;
  }
}
