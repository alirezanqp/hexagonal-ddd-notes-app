export class GetNoteByIdQuery {
  noteId: string;
  userId: string;

  constructor(props: { noteId: string; userId: string }) {
    this.noteId = props.noteId;
    this.userId = props.userId;
  }
}
