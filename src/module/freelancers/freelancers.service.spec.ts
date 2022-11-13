import { Test, TestingModule } from '@nestjs/testing';
import { FreelancersService } from './freelancers.service';

describe('FreelancersService', () => {
  let service: FreelancersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreelancersService],
    }).compile();

    service = module.get<FreelancersService>(FreelancersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
