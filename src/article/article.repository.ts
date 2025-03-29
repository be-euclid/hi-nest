import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  ArticleRequestDto, 
  ArticleResponseDto, 
  ArticleUpdateRequestDto, 
  ArticleUpdateResponseDto, 
  ArticleDeleteRequestDto, 
  ArticleDeleteResponseDto 
} from './dto';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 게시글 생성
  async createArticle(dto: ArticleRequestDto): Promise<ArticleResponseDto> {
    const article = await this.prisma.article.create({
      data: {
        userID: dto.userID,
        title: dto.title,
        content: dto.content,
      },
      select: { id: true },
    });
    return { articleID: article.id };
  }

  // 특정 게시글 조회 (게시글 ID 기준)
  async getArticleById(articleID: number): Promise<ArticleResponseDto | null> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleID },
      select: { id: true },
    });
  
    if (!article) {
      return null;
    }
  
    return {
      articleID: article.id,
    };
  }

  // 특정 유저의 게시글 조회 (유저 ID 기준)
  async getArticlesByUserId(userID: number): Promise<ArticleResponseDto[]> {
    const articles = await this.prisma.article.findMany({
      where: { userID: userID },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });
  
    return articles.map((article) => ({
      articleID: article.id, 
      title: article.title,
      content: article.content,
    }));
  }

  // 게시글 업데이트
  async updateArticle(dto: ArticleUpdateRequestDto): Promise<ArticleUpdateResponseDto> {
    const updatedArticle = await this.prisma.article.update({
      where: { id: dto.articleID },
      data: {
        title: dto.title || undefined,
        content: dto.content || undefined,
      },
    });

    return { updateCheck: !!updatedArticle };
  }

  // 게시글 삭제
  async deleteArticle(dto: ArticleDeleteRequestDto): Promise<ArticleDeleteResponseDto> {
    await this.prisma.article.deleteMany({
      where: { userID: dto.userID },
    });

    return { deleteCheck: true };
  }
}