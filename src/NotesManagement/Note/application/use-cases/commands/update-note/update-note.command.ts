import { Command, CommandProps } from '@common/application/command.base';

export class UpdateNoteCommand extends Command {
  readonly noteId: string;
  readonly title: string;
  readonly content: string;
  readonly userId: string;

  constructor(props: CommandProps<UpdateNoteCommand>) {
    super(props);

    this.noteId = props.noteId;
    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;
  }
}
