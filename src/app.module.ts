import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module'; 
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ArticleModule, PrismaModule, ArticleModule],
  /* controllers: [AppController],
  providers: [AppService],
  exports: [AppService],*/
})
export class AppModule {}
