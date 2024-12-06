import { Command, CommandProps } from '@common/application/command.base';

export class AddNoteToNotebookCommand extends Command {
  readonly notebookId: string;
  readonly noteId: string;
  readonly userId: string;

  constructor(props: CommandProps<AddNoteToNotebookCommand>) {
    super(props);

    this.notebookId = props.notebookId;
    this.noteId = props.noteId;
    this.userId = props.userId;
  }
}
