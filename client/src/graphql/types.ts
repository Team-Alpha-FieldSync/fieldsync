import type { User } from "../types/auth";

export type LoginMutationData = {
  login: {
    token: string;
    user: User;
  };
};

export type LoginMutationVariables = {
  email: string;
  password: string;
};