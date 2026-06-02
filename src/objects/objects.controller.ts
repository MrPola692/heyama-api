import {
  Controller, Get, Post, Delete,
  Param, Body, UploadedFile,
  UseInterceptors, NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  create(@Body() dto: CreateObjectDto, @UploadedFile() file: Express.Multer.File) {
    return this.objectsService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.objectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const obj = await this.objectsService.findOne(id);
    if (!obj) throw new NotFoundException();
    return obj;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const obj = await this.objectsService.remove(id);
    if (!obj) throw new NotFoundException();
    return obj;
  }
}
