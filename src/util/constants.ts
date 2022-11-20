import { PrivilegeType } from '@prisma/client';

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const SuperPrivileges: PrivilegeType[] = ['MANAGE', 'READ', 'WRITE'];
export const ReadPrivilege: PrivilegeType[] = ['READ'];
export const WritePrivilege: PrivilegeType[] = ['WRITE'];
export const ManagePrivilege: PrivilegeType[] = ['MANAGE'];
