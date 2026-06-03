import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Query,
  BadRequestException,
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
  create(
    @Body() dto: CreateObjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Image requise');

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype))
      throw new BadRequestException('Format non supporté (jpeg, png, webp)');

    if (file.size > 5 * 1024 * 1024)
      throw new BadRequestException('Image trop lourde (max 5MB)');

    return this.objectsService.create(dto, file);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.objectsService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
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
