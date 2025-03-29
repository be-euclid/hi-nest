import { Injectable } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { 
  ArticleRequestDto,
  ArticleResponseDto,
  ArticleUpdateRequestDto,
  ArticleUpdateResponseDto,
  ArticleDeleteRequestDto,
  ArticleDeleteResponseDto
} from './dto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async createArticle(dto: ArticleRequestDto): Promise<ArticleResponseDto> {
    return this.articleRepository.createArticle(dto);
  }

  async getArticleById(articleID: number): Promise<ArticleResponseDto | null> {
    return this.articleRepository.getArticleById(articleID);
  }

  async getArticlesByUserId(userID: number): Promise<ArticleResponseDto[]> {
    return this.articleRepository.getArticlesByUserId(userID);
  }

  async updateArticle(dto: ArticleUpdateRequestDto): Promise<ArticleUpdateResponseDto> {
    return this.articleRepository.updateArticle(dto);
  }

  async deleteArticle(dto: ArticleDeleteRequestDto): Promise<ArticleDeleteResponseDto> {
    return this.articleRepository.deleteArticle(dto);
  }
}