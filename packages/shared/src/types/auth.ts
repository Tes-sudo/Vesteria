export interface User {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: number;
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
}

export interface SignInParams {
  email: string;
  redirectTo?: string;
}