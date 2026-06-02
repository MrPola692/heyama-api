import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';
import { HeyamaObject, HeyamaObjectSchema } from './schemas/object.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HeyamaObject.name, schema: HeyamaObjectSchema },
    ]),
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, ObjectsGateway],
})
export class ObjectsModule {}
