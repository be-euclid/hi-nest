import { Injectable } from '@nestjs/common';
import { ArticleRepository } from './article.repository';
import { ArticleRequestDto } from './dto/article-request.dto';
import { NotificationService } from '../notification/notification.service'; 

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly notificationService: NotificationService, 
  ) {}

  async create(dto: ArticleRequestDto, userId: string) {
    const article = await this.articleRepo.createArticle(dto, userId);

    const subscribers = await this.articleRepo.getSubscribersByCategory(dto.categoryId);

    for (const subscriber of subscribers) {
      this.notificationService.sendPush({
        userId: subscriber.id,
        title: article.title,
        body: `새 글이 등록되었습니다: ${article.title}`,
      }).catch((err) => {
        console.error(`알림 전송 실패 (userId: ${subscriber.id}):`, err);
      });
    }

    return article;
  }

  async getArticlesBySubscribedCategories(userId: string) {
    return this.articleRepo.getArticlesBySubscribedCategories(userId);
  }

  async getArticlesByCategory(categoryId: string) {
    return this.articleRepo.getArticlesByCategory(categoryId);
  }
}
