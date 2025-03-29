import {IsNumber, IsString, IsOptional, IsNotEmpty} from 'class-validator';

export class ArticleUpdateRequestDto {
    @IsNumber()
    @IsNotEmpty()
    articleID: number;

    @IsString()
    @IsOptional()
    title: string;
    
    @IsString()
    @IsOptional()
    content: string;
}