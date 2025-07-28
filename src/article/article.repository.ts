// article.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ArticleRequestDto } from './dto/article-request.dto';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(dto: ArticleRequestDto, userId: string) {
    return this.prisma.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        categoryId: dto.categoryId, 
        userID: userId,
      },
    });
  }

  async getArticlesBySubscribedCategories(userId: string) {
    return this.prisma.article.findMany({
      where: {
        category: {
          subscribers: {
            some: { userId },
          },
        },
      },
      include: {
        category: true,
      },
    });
  }

  async getArticlesByCategory(categoryId: string) {
    return this.prisma.article.findMany({
      where: { categoryId: Number(categoryId) }
    });
  }
  
  async getSubscribersByCategory(categoryId: number) {
    return this.prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            categoryId: categoryId,
          },
        },
      },
    });
  }
}
