import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ArticleRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: number; 
}