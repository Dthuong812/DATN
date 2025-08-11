import { SensorsTypesEntity } from './Services/Domain/Models/sensor_types.entity';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './Services/module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter, ValidationExceptionFilter } from './common/Util';
import { DataContext } from './common/Infrastructure/Data/DataContext';
import { ValidationLoggingPipe } from './logger/validation-logging-pipe';
import { AllExceptionsFilter } from './logger/all-exceptions-filter';
import { SuccessLoggingInterceptor } from './logger/success-logging-interceptor';
import { LogsService } from './Services/Application/Services/LogsService';
import { RequestLoggingInterceptor } from './logger/request-logging-interceptor';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dbUrl = process.env.DATABASE_URL!;
  await DataContext.getInstance(dbUrl,[]);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 6000,
    },
  });

  app.useGlobalFilters(new ValidationExceptionFilter(), new HttpExceptionFilter());
  await app.startAllMicroservices();
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('EcoMonitor API')
    .setDescription('API documentation for EcoMonitor Environmental Monitoring System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT', 
    ) 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: false,
  });
  const logsService = app.get(LogsService);
  app.useGlobalPipes(new ValidationLoggingPipe(logsService));
  app.useGlobalFilters(new AllExceptionsFilter(logsService));
  app.useGlobalInterceptors(new SuccessLoggingInterceptor(logsService));
  app.useGlobalInterceptors(new RequestLoggingInterceptor(logsService));
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server running at http://localhost:${port}/api`);

}
bootstrap();
