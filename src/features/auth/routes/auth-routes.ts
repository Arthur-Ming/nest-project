import { resources } from '../../../common/enum/resources';

export enum AuthRoutes {
  base = resources.auth,
  registration = 'registration',
  login = 'login',
  registrationConfirmation = 'registration-confirmation',
  registrationEmailResending = 'registration-email-resending',
  me = 'me',
  newPassword = 'new-password',
  passwordRecovery = 'password-recovery',
}
