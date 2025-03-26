import { Controller, Get, Post, Put, Delete, Body, Query } from '@nestjs/common';
import { ArticleService } from '../article/article.service';
import { ArticleRequestDto } from '../article/article-request.dto';
import { ArticleResponseDto } from '../article/article-response.dto';
import { ArticleUpdateRequestDto } from '../article/article-update-request.dto';
import { ArticleUpdateResponseDto } from '../article/article-update-response.dto';
import { ArticleDeleteRequestDto } from '../article/article-delete-request.dto';
import { ArticleDeleteResponseDto } from '../article/article-delete-response.dto';

@Controller('api/article')
export class ArticleController 
{
  constructor(private readonly articleService: ArticleService) {}

  // 게시글 생성 API
  @Post('post')
  createArticle(@Body() articleRequestDto: ArticleRequestDto): ArticleResponseDto 
  {
    return this.articleService.createArticle(articleRequestDto);
  }

  // 게시글 업데이트 API
  @Put('put')
  updateArticle(@Body() articleUpdateDto: ArticleUpdateRequestDto): ArticleUpdateResponseDto 
  {
    return this.articleService.updateArticle(articleUpdateDto);
  }

  // 게시글 삭제 API
  @Delete('delete')
  deleteArticle(@Body() articleDeleteDto: ArticleDeleteRequestDto): ArticleDeleteResponseDto 
  {
    return this.articleService.deleteArticle(articleDeleteDto);
  }

  // 게시글 조회 API (게시글 ID로 조회)
  @Get('articleID/search')
  getArticleById(@Query('articleID') articleID: number): ArticleResponseDto 
  {
    return this.articleService.getArticleByArticleId(Number(articleID));
  }

  // 게시글 조회 API (유저 ID로 조회)
  @Get('userID/search')
  getArticlesByUserId(@Query('userID') userID: number): { articles: ArticleResponseDto[] } 
  {
    return this.articleService.getArticlesByUserId(Number(userID));
  }
}