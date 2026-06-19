import { UserRole } from '../../generated/prisma/enums';

export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  phone?: string;
  role?: UserRole;
}
