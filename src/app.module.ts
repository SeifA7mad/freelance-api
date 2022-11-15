import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Controllers imports
import { AppController } from './app.controller';

// Services imports
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './module/users/users.module';
import { AccountsModule } from './module/accounts/accounts.module';
import { FreelancersModule } from './module/freelancers/freelancers.module';
import { ClientsModule } from './module/clients/clients.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
