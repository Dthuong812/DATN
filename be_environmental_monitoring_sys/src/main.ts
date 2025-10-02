
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter, ValidationExceptionFilter } from './common/Util';
import { DataContext } from './common/Infrastructure/Data/DataContext';
import { ValidationLoggingPipe } from './logger/validation-logging-pipe';
import { AllExceptionsFilter } from './logger/all-exceptions-filter';
import { SuccessLoggingInterceptor } from './logger/success-logging-interceptor';

import { RequestLoggingInterceptor } from './logger/request-logging-interceptor';
import { AppModule } from './Services/Version1.0/module';
import { LogsService } from './Services/Version1.0/Application/Services/LogsService';
import { Version2Module } from './Services/Version2.0/module';
import { DeviceDataEntity } from './Services/Version2.0/Domain/Models/device_data.entity';
import { LocalEntity } from './Services/Version2.0/Domain/Models/local.entity';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.useGlobalPipes(new ValidationLoggingPipe(logsService, 'Version1.0'));
  app.useGlobalFilters(new AllExceptionsFilter(logsService, 'Version1.0'));
  // app.useGlobalInterceptors(new SuccessLoggingInterceptor(logsService, 'Version1.0'));
  app.useGlobalInterceptors(new RequestLoggingInterceptor(logsService, 'Version1.0'));
  

  //ver 2.0
  const Version2 = await NestFactory.create(Version2Module);
  const db = await DataContext.getInstance(
    process.env.DATABASE_URL_VER_2,
    [DeviceDataEntity,LocalEntity],
  );
  Version2.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 7000,
    },
  });
  // Version2.connectMicroservice<MicroserviceOptions>({
  //   transport : Transport.MQTT,
  //   options: {
  //     url: 'mqtt://192.168.32.100:1883',
  //   }
  // });
  await Version2.startAllMicroservices();
  Version2.useGlobalFilters(new ValidationExceptionFilter(), new HttpExceptionFilter());
  Version2.useGlobalFilters(new AllExceptionsFilter(logsService, 'Version2.0')); 
  Version2.useGlobalInterceptors(new SuccessLoggingInterceptor(logsService, 'Version2.0')); 
  // Version2.useGlobalInterceptors(new RequestLoggingInterceptor(logsService, 'Version2.0')); 
  Version2.useGlobalPipes(new ValidationLoggingPipe(logsService, 'Version2.0')); 
  Version2.useGlobalFilters(new ValidationExceptionFilter(), new HttpExceptionFilter());
  Version2.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: false,
  });

  Version2.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  let ver2 = new DocumentBuilder()
    .setTitle('Service version 2.0')
    .setDescription('API documentation')
    .setVersion('2.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT', 
    )
    .build();
  const documentV2 = SwaggerModule.createDocument(Version2, ver2);
  SwaggerModule.setup('api', Version2, documentV2);

  await Promise.all([app.listen(4000), Version2.listen(5000)]);
  console.log(`Service version 1.0 is running on http://localhost:4000/api`);
  console.log(`Service version 2.0 is running on http://localhost:5000/api`); 

}
bootstrap();
