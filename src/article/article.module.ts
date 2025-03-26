import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  imports: [],
  controllers: [ArticleController], // ArticleController 등록
  providers: [ArticleService], // ArticleService 등록
})
export class ArticleModule {}