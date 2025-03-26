import { IsNumber, IsNotEmpty } from 'class-validator';

export class ArticleDeleteRequestDto
{ 
    @IsNumber()
    @IsNotEmpty()
    userID: number;
}