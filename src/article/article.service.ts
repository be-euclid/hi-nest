import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from './article.entity';
import { ArticleRequestDto } from './article-request.dto';
import { ArticleUpdateRequestDto } from './article-update-request.dto';
import { ArticleDeleteRequestDto } from './article-delete-request.dto';

@Injectable()
export class ArticleService {
  private articles: Article[] = []; // Article 엔티티 배열로 데이터 저장

  // 게시글 생성
  createArticle(articleRequestDto: ArticleRequestDto): { articleID: number } {
    const { userID, title, content } = articleRequestDto;
    const articleId = this.articles.length + 1; // 새 게시글 ID 생성 (배열 길이 + 1)
    const newArticle = new Article(articleId, userID, title, content); // Article 엔티티 객체 생성
    this.articles.push(newArticle); // 배열에 게시글 추가
    return { articleID: articleId }; // 생성된 게시글 ID 반환
  }

  // 게시글 업데이트
  updateArticle(articleUpdateDto: ArticleUpdateRequestDto): { updateCheck: boolean } {
    const article = this.articles.find(a => a.articleID === articleUpdateDto.articleID); // 게시글 찾기
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (articleUpdateDto.title) article.title = articleUpdateDto.title; // 제목 업데이트
    if (articleUpdateDto.content) article.content = articleUpdateDto.content; // 본문 업데이트

    return { updateCheck: true }; // 업데이트 성공
  }

  // 게시글 삭제
  deleteArticle(articleDeleteDto: ArticleDeleteRequestDto): { deleteCheck: boolean } {
    const initialLength = this.articles.length;
    this.articles = this.articles.filter(a => a.userID !== articleDeleteDto.userID); // 해당 유저의 게시글 삭제
    return { deleteCheck: this.articles.length !== initialLength }; // 삭제된 게시글이 있으면 true
  }

  // 게시글 조회 (ID로 조회)
  getArticleByArticleId(articleId: number): Article {
    const article = this.articles.find(a => a.articleID === articleId); // 게시글 ID로 찾기
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article; // 찾은 게시글 반환
  }

  // 유저 ID로 게시글 조회
  getArticlesByUserId(userID: number): { articles: Article[] } {
    const articles = this.articles.filter(a => a.userID === userID); // 유저 ID로 게시글 필터링
    return { articles }; // 필터링된 게시글 목록 반환
  }
}