import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MoveNoteToNotebookRequestDto {
  @ApiProperty({
    description: 'Target Notebook ID',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  targetNotebookId: string;

  @ApiProperty({
    description: 'Source Notebook ID (optional)',
    required: false,
  })
  @IsUUID()
  sourceNotebookId?: string;
}
