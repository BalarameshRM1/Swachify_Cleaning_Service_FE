export type User = {
  id: number;
  name: string;
  email: string;
  username: string;
};

export type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};
