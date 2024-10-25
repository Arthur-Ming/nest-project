import { UsersOutputModel } from '../../api/dto/output/users.output.model';
import { UserDocument } from '../../domain/users.entity';

export function userMapToOutput(dbUser: UserDocument): UsersOutputModel {
  return {
    id: dbUser.id.toString(),
    login: dbUser.login,
    email: dbUser.email,
    createdAt: new Date(dbUser.createdAt).toISOString(),
  };
}
