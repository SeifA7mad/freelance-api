import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}
  create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.createMany({
      data: createSkillDto.skills,
      skipDuplicates: true,
    });
  }

  findAll() {
    return this.prisma.skill.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.skill.delete({
      where: {
        id: id,
      },
    });
  }
}
