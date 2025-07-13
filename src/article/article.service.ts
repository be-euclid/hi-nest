import { Injectable } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { ArticleRequestDto } from './dto/article-request.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepo: ArticleRepository) {}

  async create(dto: ArticleRequestDto, userId: string) {
    return this.articleRepo.createArticle(dto, userId);
  }

  async getArticlesBySubscribedCategories(userId: string) {
    return this.articleRepo.getArticlesBySubscribedCategories(userId);
  }

  async getArticlesByCategory(categoryId: string) {
    return this.articleRepo.getArticlesByCategory(categoryId);
  }
}