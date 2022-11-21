import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Services imports
import { SkillsService } from './skills.service';

// Dto's imports
import { CreateSkillDto } from './dto/create-skill.dto';

// Guards imports
import { AdminAuthGuard } from 'src/guard/admin-auth.guard';

// Utils imports
import { ManagePrivilege, WritePrivilege } from 'src/util/constants';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { CreateSkillSchema } from './validation/create-skill';
import { UserAuthGuard } from 'src/guard/user-auth.guard';

@ApiTags('Skill')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post('admin')
  @UseGuards(new AdminAuthGuard(WritePrivilege))
  @UsePipes(new ZodValidationPipe(CreateSkillSchema))
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  findAll() {
    return this.skillsService.findAll();
  }

  @Delete('admin/:id')
  @UseGuards(new AdminAuthGuard(ManagePrivilege))
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
