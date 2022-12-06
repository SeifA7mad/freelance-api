import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuthGuard } from 'src/guard/client-auth.guard';
import { ZodValidationPipe } from 'src/pipe/ZodValidationPipe';
import { CreateProjectSchema } from './validation/create-project.validation';
import { JwtUserRequest } from 'src/util/global-types';
import { UpdateProjectSchema } from './validation/update-project.validation';
import { AdminAuthGuard } from 'src/guard/admin-auth.guard';
import { ReadPrivilege } from 'src/util/constants';

@ApiTags('Project')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(ClientAuthGuard)
  @UsePipes(new ZodValidationPipe(CreateProjectSchema))
  create(
    @Req() req: JwtUserRequest,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  @UseGuards(ClientAuthGuard)
  findAll(@Req() req: JwtUserRequest) {
    return this.projectsService.findAll(req.user.id);
  }

  @Get('admin')
  @UseGuards(new AdminAuthGuard(ReadPrivilege))
  findAllAdmin() {
    return this.projectsService.findAllAdmin();
  }

  @Get(':id')
  @UseGuards(ClientAuthGuard)
  findOne(@Req() req: JwtUserRequest, @Param('id') id: string) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Get('admin/:id')
  @UseGuards(new AdminAuthGuard(ReadPrivilege))
  findOneAdmin(@Param('id') id: string) {
    return this.projectsService.findOneAdmin(id);
  }

  @Patch(':id')
  @UseGuards(ClientAuthGuard)
  update(
    @Req() req: JwtUserRequest,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProjectSchema))
    updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(ClientAuthGuard)
  remove(@Req() req: JwtUserRequest, @Param('id') id: string) {
    return this.projectsService.remove(id, req.user.id);
  }
}
