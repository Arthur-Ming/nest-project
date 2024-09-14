import { appSettings } from '../../../src/settings/app-settings';

export type BasicAuthCredentials = {
  login: string;
  password: string;
};

export const correctBasicAuthCredentials = {
  login: appSettings.api.ADMIN_LOGIN,
  password: appSettings.api.ADMIN_PASSWORD,
};

export const inCorrectBasicAuthCredentials = {
  login: '',
  password: '',
};
