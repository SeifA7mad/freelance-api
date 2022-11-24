import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto, clientId: string) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        client: {
          connect: { id: clientId },
        },
      },
    });
  }

  findAll(clientId: string) {
    return this.prisma.project.findMany({
      where: {
        clientId: clientId,
      },
    });
  }

  findAllAdmin() {
    return this.prisma.project.findMany({
      include: {
        client: true,
      },
    });
  }

  findOne(id: string, clientId: string) {
    return this.prisma.project.findUnique({
      where: {
        id_clientId: { id, clientId },
      },
      include: {
        contract: true,
        job: true,
      },
    });
  }

  findOneAdmin(id: string) {
    return this.prisma.project.findUnique({
      where: {
        id: id,
      },
      include: {
        client: true,
        contract: true,
        job: true,
      },
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto, clientId: string) {
    return this.prisma.project.update({
      where: {
        id_clientId: { id, clientId },
      },
      data: updateProjectDto,
      include: {
        contract: true,
        job: true,
      },
    });
  }

  remove(id: string, clientId: string) {
    return this.prisma.project.delete({
      where: {
        id_clientId: { id, clientId },
      },
    });
  }
}
