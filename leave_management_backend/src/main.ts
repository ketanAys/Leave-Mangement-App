import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
<<<<<<< HEAD
  await app.listen(process.env.SERVER_PORT);
=======
  await app.listen(3002);
>>>>>>> dd2948662f028272129db33bba63a72733cad706
=======
  const config = new DocumentBuilder()
    .setTitle('Leave Management API')
    .setDescription('leave management API description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
>>>>>>> shruti
}
bootstrap();
