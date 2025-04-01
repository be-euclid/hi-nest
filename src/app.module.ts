import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user/user.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ArticleModule, PrismaModule, ArticleModule],
  providers: [PrismaService, UserRepository],
  /* controllers: [AppController],
  providers: [AppService],
  exports: [AppService],*/
})
export class AppModule {}
