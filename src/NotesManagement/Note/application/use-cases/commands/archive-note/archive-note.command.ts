import { Command, CommandProps } from '@common/application/command.base';

export class ArchiveNoteCommand extends Command {
  readonly noteId: string;
  readonly userId: string;

  constructor(props: CommandProps<ArchiveNoteCommand>) {
    super(props);

    this.noteId = props.noteId;
    this.userId = props.userId;
  }
}
