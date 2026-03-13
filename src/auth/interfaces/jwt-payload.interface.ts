import { Request } from 'express';
import { UserRole } from 'src/users/enums/user-role.enum';

export interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
