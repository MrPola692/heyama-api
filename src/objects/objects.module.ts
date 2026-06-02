import { Module } from '@nestjs/common';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';

@Module({
  controllers: [ObjectsController],
  providers: [ObjectsService, ObjectsGateway]
})
export class ObjectsModule {}
