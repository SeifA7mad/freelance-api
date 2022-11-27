import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

const JobInclude = Prisma.validator<Prisma.JobInclude>()({
  project: true,
  requiredSkills: {
    select: {
      skill: {
        select: {
          name: true,
        },
      },
    },
  },
});

const JobIncludeAll = Prisma.validator<Prisma.JobInclude>()({
  project: true,
  requiredSkills: {
    select: {
      skill: {
        select: {
          name: true,
        },
      },
    },
  },
  jobInvitations: true,
  contract: true,
});

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  create(clientId: string, createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        title: createJobDto.title,
        link: createJobDto.link,
        location: createJobDto.location,
        visibility: createJobDto.visibility,
        postedAt: createJobDto.postedAt,
        requiredExperienceLevel: createJobDto.requiredExperienceLevel,
        requiredSkills: {
          createMany: {
            data: createJobDto.requiredSkills,
            skipDuplicates: true,
          },
        },
        client: {
          connect: {
            id: clientId,
          },
        },
        project: {
          connect: {
            id_clientId: {
              id: createJobDto.projectId,
              clientId: clientId,
            },
          },
        },
      },
      include: JobInclude,
    });
  }

  findAll(clientId: string) {
    return this.prisma.job.findMany({
      where: {
        clientId: clientId,
      },
      include: JobInclude,
    });
  }

  findOne(id: string, clientId: string) {
    return this.prisma.job.findUnique({
      where: {
        id_clientId: {
          clientId: clientId,
          id: id,
        },
      },
      include: JobIncludeAll,
    });
  }

  async update(id: string, clientId: string, updateJobDto: UpdateJobDto) {
    const updateInputs = {
      title: updateJobDto.title,
      link: updateJobDto.link,
      location: updateJobDto.location,
      visibility: updateJobDto.visibility,
      requiredExperienceLevel: updateJobDto.requiredExperienceLevel,
      postedAt: updateJobDto.postedAt,
    };

    if (updateJobDto.requiredSkills) {
      await this.prisma.job.update({
        where: {
          id_clientId: {
            id: id,
            clientId: clientId,
          },
        },
        data: {
          requiredSkills: {
            deleteMany: {},
          },
        },
      });

      return this.prisma.job.update({
        where: {
          id_clientId: {
            id: id,
            clientId: clientId,
          },
        },
        data: {
          ...updateInputs,
          requiredSkills: {
            createMany: {
              data: updateJobDto.requiredSkills,
              skipDuplicates: true,
            },
          },
        },
        include: JobInclude,
      });
    }

    return this.prisma.job.update({
      where: {
        id_clientId: {
          id: id,
          clientId: clientId,
        },
      },
      data: {
        ...updateInputs,
      },
      include: JobInclude,
    });
  }

  remove(id: string, clientId: string) {
    return this.prisma.job.delete({
      where: {
        id_clientId: {
          id: id,
          clientId: clientId,
        },
      },
    });
  }
}
