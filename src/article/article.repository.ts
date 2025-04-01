import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 게시글 생성 (DB 저장)
  async createArticle(userID: number, title: string, content: string) {
    return this.prisma.article.create({
      data: { userID, title, content },
    });
  }

  // 특정 게시글 조회 (게시글 ID)
  async getArticleById(articleID: number) {
    return this.prisma.article.findUnique({
      where: { id: articleID },
    });
  }

  // 특정 유저의 게시글 조회 (유저 ID)
  async getArticlesByUserId(userID: number) {
    return this.prisma.article.findMany({
      where: { userID },
    });
  }

  // 게시글 업데이트 (DB 업데이트)
  async updateArticle(articleID: number, title?: string, content?: string) {
    return this.prisma.article.update({
      where: { id: articleID },
      data: { title, content },
    });
  }

  // 게시글 삭제 (DB 삭제)
  async deleteArticle(userID: number) {
    return this.prisma.article.deleteMany({
      where: { userID },
    });
  }
}
