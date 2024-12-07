import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NotebookNoteRequestDto {
  @ApiProperty({ description: 'ID of the note' })
  @IsNotEmpty()
  @IsString()
  noteId: string;
}
