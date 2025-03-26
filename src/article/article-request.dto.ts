import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class ArticleRequestDto { 
    @IsNumber()
    @IsNotEmpty()
    userID: number;
    
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    content: string;
}