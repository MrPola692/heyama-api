import { Test, TestingModule } from '@nestjs/testing';
import { ObjectsGateway } from './objects.gateway';

describe('ObjectsGateway', () => {
  let gateway: ObjectsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectsGateway],
    }).compile();

    gateway = module.get<ObjectsGateway>(ObjectsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
