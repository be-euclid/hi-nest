import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ArticleModule],
  /* controllers: [AppController],
  providers: [AppService],
  exports: [AppService],*/
})
export class AppModule {}
