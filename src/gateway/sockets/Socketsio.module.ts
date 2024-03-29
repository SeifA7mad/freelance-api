import { Module } from '@nestjs/common';
import { AuthModule } from 'src/module/auth/auth.module';
import { SocketsIoGateway } from './Socketsio.gateway';

@Module({
  providers: [SocketsIoGateway],
})
export class SocketsIoModule {}
