import { Module, CacheModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

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
import { ProjectsModule } from './module/projects/projects.module';
import { SocketsIoModule } from './gateway/sockets/Socketsio.module';
import { JobsModule } from './module/jobs/jobs.module';
import { ProposalsModule } from './module/proposals/proposals.module';
import { StripeModule } from './module/stripe/stripe.module';

// Interceptor imports
import { ErrorsInterceptor } from './interceptor/Errors.interceptor';
import { TransformResponseInterceptor } from './interceptor/TransformResponse.interceptor';
import { PaymentMethodsModule } from './module/payment-methods/payment-methods.module';
import { WalletsModule } from './module/wallets/wallets.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core/constants';
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard';
import { ContractsModule } from './module/contracts/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    CacheModule.register<any>({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      no_ready_check: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
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
    JobsModule,
    ProposalsModule,
    StripeModule,
    PaymentMethodsModule,
    WalletsModule,
    ContractsModule,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
