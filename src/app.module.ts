import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [ObjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
