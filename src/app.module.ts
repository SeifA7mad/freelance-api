import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Controllers imports
import { AppController } from './app.controller';

// Services imports
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
