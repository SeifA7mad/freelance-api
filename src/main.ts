import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import helmet from 'helmet';

async function bootstrap() {
  // const httpsOptions = {
  //   key: readFileSync('./secrets/private-key.pem'),
  //   cert: readFileSync('./secrets/public-certificate.pem'),
  // };

  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Freelance')
    .setDescription('The Freelance API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(+process.env.SERVER_PORT || 3000);
}
bootstrap();
