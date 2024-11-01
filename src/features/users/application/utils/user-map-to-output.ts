import { UsersOutputModel } from '../../api/dto/output/users.output.model';

export function userMapToOutput(dbUser: any): UsersOutputModel {
  return {
    id: dbUser.id.toString(),
    login: dbUser.login,
    email: dbUser.email,
    createdAt: new Date(dbUser.createdAt).toISOString(),
  };
}
