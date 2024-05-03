export type User = {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  deactivated: boolean;
  provider: string;
  password: string;
};
