interface BaseAuthType {
  email: string;
  password: string;
}

export interface LoginType extends BaseAuthType {}

export interface RegisterType extends BaseAuthType {
  name: string;
}
