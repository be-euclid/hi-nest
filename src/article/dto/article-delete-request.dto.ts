import { IsNumber, IsNotEmpty } from 'class-validator';

export class ArticleDeleteRequestDto{ 
    @IsNumber()
    @IsNotEmpty()
    articleID: number; 

    @IsNumber()
    @IsNotEmpty()
    userID: number;
}