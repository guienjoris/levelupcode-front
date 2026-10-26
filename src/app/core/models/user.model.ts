export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  isSupporter?: boolean;
  avatarUrl?: string;
  emailDailyReminder?: boolean;
  currentStreak?: number;
  longestStreak?: number;
}

export interface UserProfile extends User {
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshResponse {
  accessToken: string;
}
