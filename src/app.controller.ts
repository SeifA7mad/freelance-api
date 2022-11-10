import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Freelancer as FreelancerModel } from '@prisma/client';
import { Body, Delete, Post } from '@nestjs/common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getFreelancers(): Promise<FreelancerModel[]> {
    return this.appService.freelancers();
  }

  @Post()
  async createFreelancer(
    @Body() freelancerData: FreelancerModel,
  ): Promise<FreelancerModel> {
    console.log(freelancerData);
    return this.appService.createFreelancer(freelancerData);
  }

  @Delete()
  async deleteFreelancer(): Promise<number> {
    return this.appService.deleteFreelancers();
  }
}
