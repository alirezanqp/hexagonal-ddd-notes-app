export class GetNoteByIdQuery {
  readonly noteId: string;
  readonly userId: string;

  constructor(props: GetNoteByIdQuery) {
    this.noteId = props.noteId;
    this.userId = props.userId;
  }
}
