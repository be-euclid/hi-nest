import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, catchError, of } from 'rxjs';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly httpService: HttpService) {}

async sendPush({
  userId,
  title,
  body,
}: {
  userId: string;
  title: string;
  body: string;
}) {
  const payload = {
    userId,
    deviceId: Math.random().toString(36).substring(2, 15),
    message: `${title}\n${body}`,
  };

  const attempt = async (retry = false): Promise<boolean> => {
    try {
      const res = await firstValueFrom(
        this.httpService.post('http://localhost:3001/push', payload).pipe(
          catchError((err) => {
            this.logger.error(`Push request failed for ${userId}`, err);
            return of({ data: { result: -1 } });
          }),
        ),
      );

      if (res.data.result === -1) {
        if (!retry) {
          this.logger.warn(`Push failed (result -1) for ${userId}, retrying...`);
          return await attempt(true); // 재시도 1회
        } else {
          this.logger.error(`Push permanently failed for ${userId} after retry.`);
          return false;
        }
      }

      this.logger.log(`Push success for user ${userId}`);
      return true;
    } catch (err) {
      this.logger.error(`Unexpected error during push to ${userId}`, err);
      return false;
    }
  };

  await attempt();
}
}
