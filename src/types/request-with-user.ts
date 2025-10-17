import { Request } from 'express';
import { UserType } from 'src/common/user-type-.enum';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email_address: string;
    user_type: UserType;
    is_active: boolean;
    // Puedes agregar más campos si tu token incluye otros datos
  };
}