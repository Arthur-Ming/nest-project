import { createUserDtoMock } from '../mock-data/create-user.dto.mock';

export const newUserModel = {
  id: expect.any(String),
  login: createUserDtoMock.login,
  email: createUserDtoMock.email,
  createdAt: expect.any(String),
};
