import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() { //bootstrap이라는 자유로운 이름 선언 가능
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
