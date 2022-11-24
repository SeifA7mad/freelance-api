import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// Controllers imports
import { AppController } from './app.controller';

// Services imports
import { AppService } from './app.service';

// Modules imports
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './module/users/users.module';
import { AccountsModule } from './module/accounts/accounts.module';
import { FreelancersModule } from './module/freelancers/freelancers.module';
import { ClientsModule } from './module/clients/clients.module';
import { AuthModule } from './module/auth/auth.module';
import { SkillsModule } from './module/skills/skills.module';

// Interceptor imports
import { ErrorsInterceptor } from './interceptor/Errors.interceptor';
import { TransformResponseInterceptor } from './interceptor/TransformResponse.interceptor';
import { ProjectsModule } from './module/projects/projects.module';
import { SocketsIoModule } from './gateway/sockets/Socketsio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AccountsModule,
    FreelancersModule,
    ClientsModule,
    AuthModule,
    SkillsModule,
    ProjectsModule,
    SocketsIoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
