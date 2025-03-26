import {IsString, IsOptional} from 'class-validator';

export class ArticleUpdateRequestDto 
{ 
    @IsString()
    @IsOptional()
    title: string;
    
    @IsString()
    @IsOptional()
    content: string;
}