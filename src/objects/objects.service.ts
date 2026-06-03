import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HeyamaObject, ObjectDocument } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { ObjectsGateway } from './objects.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ObjectsService {
  private s3: S3Client;

  constructor(
    @InjectModel(HeyamaObject.name) private objectModel: Model<ObjectDocument>,
    private readonly gateway: ObjectsGateway,
  ) {
    this.s3 = new S3Client({
      region: process.env.B2_REGION,
      endpoint: process.env.B2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID as string,
        secretAccessKey: process.env.B2_APP_KEY as string,
      },
    });
  }

  async create(dto: CreateObjectDto, file: Express.Multer.File) {
    const key = `${uuidv4()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const created = await this.objectModel.create({
      title: dto.title,
      description: dto.description,
      imageKey: key,
    });

    const withUrl = await this.attachSignedUrl(created.toObject());
    this.gateway.notifyNewObject(withUrl);
    return withUrl;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [objects, total] = await Promise.all([
      this.objectModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.objectModel.countDocuments(),
    ]);

    const data = await Promise.all(objects.map((o) => this.attachSignedUrl(o)));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const obj = await this.objectModel.findById(id).lean();
    if (!obj) return null;
    return this.attachSignedUrl(obj);
  }

  async remove(id: string) {
    const obj = await this.objectModel.findByIdAndDelete(id).lean();
    if (!obj) return null;

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: obj.imageKey,
      }),
    );

    this.gateway.notifyDeletedObject(id);
    return obj;
  }

  private async attachSignedUrl(obj: any) {
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: obj.imageKey,
      }),
      { expiresIn: 3600 },
    );
    return { ...obj, imageUrl: url };
  }
}
