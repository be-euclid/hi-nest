import { 
  Controller, Post, Body, Get, Query, Patch, Delete, UseGuards, Request, ParseIntPipe 
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  ArticleRequestDto,
  ArticleResponseDto,
  ArticleUpdateRequestDto,
  ArticleUpdateResponseDto,
  ArticleDeleteRequestDto,
  ArticleDeleteResponseDto
} from './dto';

@Controller('api/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 게시글 생성 API
  @Post('post')
  async createArticle(@Body() dto: ArticleRequestDto): Promise<ArticleResponseDto> {
    return this.articleService.createArticle(dto);
  }

  // 게시글 ID로 조회 API
  @Get('articleID/search')
  async getArticleById(@Query('articleID', ParseIntPipe) articleID: number): Promise<ArticleResponseDto | null> {
    return this.articleService.getArticleById(articleID);
  }

  // 유저 ID로 게시글 조회 API
  @Get('userID/search')
  async getArticlesByUserId(@Query('userID', ParseIntPipe) userID: number): Promise<ArticleResponseDto[]> {
    return this.articleService.getArticlesByUserId(userID);
  }

  // 게시글 업데이트 API
  @Patch('patch')
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Request() req, 
    @Body() dto: ArticleUpdateRequestDto
  ): Promise<ArticleUpdateResponseDto> {
    return this.articleService.updateArticle(dto.articleID, dto, req.user.userID);
  }

  // 게시글 삭제 API 
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Request() req,
    @Body() dto: ArticleDeleteRequestDto
  ): Promise<ArticleDeleteResponseDto> {
    return this.articleService.deleteArticle(dto.articleID, req.user.userID);
  }
}
