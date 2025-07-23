import { SensorsTypesEntity } from './Services/Domain/Models/sensor_types.entity';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './Services/module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter, ValidationExceptionFilter } from './common/Util';
import { DataContext } from './common/Infrastructure/Data/DataContext';
import { UserEntity } from './Services/Domain/Models/users.entity';
import { RolesEntity } from './Services/Domain/Models/roles.entity';
import { RoleFunctionPermissionEntity } from './Services/Domain/Models/role_function_permission.entity';
import { FunctionsEntity } from './Services/Domain/Models/functions.entity';
import { PermissionsEntity } from './Services/Domain/Models/permissions.entity';
import { LocationsEntity } from './Services/Domain/Models/locations.entity';
import { SensorsEntity } from './Services/Domain/Models/sensors.entity';
import { StationsEnity } from './Services/Domain/Models/stations.entity';
import { LogTypesEntity } from './Services/Domain/Models/log_types.entity';
import { LogsEntity } from './Services/Domain/Models/logs.entity';
import { UserRoleAssignmentsEntity } from './Services/Domain/Models/user_role_assignments.entity';
import { SensorDataEntity } from './Services/Domain/Models/sensor_data.entity';


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

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server running at http://localhost:${port}/api`);

}
bootstrap();
