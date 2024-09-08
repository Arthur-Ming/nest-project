import { resources } from '../../../common/enum/resources';

export enum AuthRoutes {
  base = resources.auth,
  registration = 'registration',
  login = 'login',
  registrationConfirmation = 'registration-confirmation',
  me = 'me',
}
