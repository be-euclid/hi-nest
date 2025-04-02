import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  // 게시글 생성
  async createArticle(dto: ArticleRequestDto): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.createArticle(dto.userID, dto.title, dto.content);
    return { articleID: article.id };
  }

  // 게시글 조회 (게시글 ID 기준)
  async getArticleById(articleID: number): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.getArticleById(articleID);
    if (!article) {
      throw new NotFoundException(`Article with ID ${articleID} not found`);
    }
    return { articleID: article.id };
  }

  // 특정 유저의 게시글 조회
  async getArticlesByUserId(userID: number): Promise<ArticleResponseDto[]> {
    const articles = await this.articleRepository.getArticlesByUserId(userID);
    return articles.map((article) => ({
      articleID: article.id,
      title: article.title,
      content: article.content,
    }));
  }

  // 게시글 업데이트
  async updateArticle(articleId: number, dto: ArticleUpdateRequestDto, userId: number): Promise<ArticleUpdateResponseDto> {
    const article = await this.articleRepository.getArticleById(articleId);
    if (!article || article.userID !== userId) {
      throw new UnauthorizedException('수정할 권한이 없습니다.');
    }
    await this.articleRepository.updateArticle(articleId, dto.title, dto.content);
    return { updateCheck: true };
  }
  
  // 게시글 삭제
  async deleteArticle(articleId: number, userId: number): Promise<ArticleDeleteResponseDto> {
    const article = await this.articleRepository.getArticleById(articleId);
    if (!article || article.userID !== userId) {
      throw new UnauthorizedException('삭제할 권한이 없습니다.');
    }
    await this.articleRepository.deleteArticle(articleId);
    return { deleteCheck: true };
  }
  
}
