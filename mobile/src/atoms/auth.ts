import { atom, useRecoilValue } from 'recoil';

export type User = {
  id: string | number;
  name: string;
};

export type AuthState = {
  // user: User | null;
  isAuthenticated: boolean;
};

const authDefaultState: AuthState = {
  isAuthenticated: false,
  // user: null,
};

export const authAtom = atom<AuthState>({
  key: 'authAtom',
  default: authDefaultState,
});

export const useAuthValue = () => useRecoilValue(authAtom);
