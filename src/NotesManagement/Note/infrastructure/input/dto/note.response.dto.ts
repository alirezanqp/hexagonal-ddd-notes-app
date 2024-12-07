import { ApiProperty } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  isArchived: boolean;

  @ApiProperty()
  createdAt: Date;
}
