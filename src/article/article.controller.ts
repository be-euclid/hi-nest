import { Controller, Post, Body, UseGuards, Get, Request, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleRequestDto } from './dto/article-request.dto';
import { IdpAuthGuard } from '../auth/idp.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(IdpAuthGuard)
  @Post()
  async create(@Body() dto: ArticleRequestDto, @Request() req) {
    return this.articleService.create(dto, req.user.id);
  }

  @UseGuards(IdpAuthGuard)
  @Get('subscribed')
  async getSubscribed(@Request() req) {
    return this.articleService.getArticlesBySubscribedCategories(req.user.id);
  }

  @Get()
  async getByCategory(@Query('categoryId') categoryId: string) {
    return this.articleService.getArticlesByCategory(categoryId);
  }
}