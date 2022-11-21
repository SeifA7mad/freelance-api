import { Prisma } from '@prisma/client';

export const userIncludeAccount = Prisma.validator<Prisma.UserInclude>()({
  account: {
    select: {
      email: true,
      userName: true,
    },
  },
});

export const freelancerIncludeAll =
  Prisma.validator<Prisma.FreelancerInclude>()({
    freelancerSkills: {
      select: {
        skill: {
          select: {
            name: true,
          },
        },
        level: true,
      },
    },
    contracts: true,
    proposals: true,
    jobInvitations: true,
    user: {
      include: userIncludeAccount,
    },
  });
