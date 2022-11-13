import { Test, TestingModule } from '@nestjs/testing';
import { FreelancersController } from './freelancers.controller';
import { FreelancersService } from './freelancers.service';

describe('FreelancersController', () => {
  let controller: FreelancersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreelancersController],
      providers: [FreelancersService],
    }).compile();

    controller = module.get<FreelancersController>(FreelancersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
