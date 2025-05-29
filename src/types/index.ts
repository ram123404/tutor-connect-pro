
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  profilePic?: string;
  isBlocked?: boolean;
  createdAt?: string;
  tutorProfile?: {
    subjects: string[];
    experience: number;
    availability: string;
    monthlyRate: number;
    education: string[];
    about: string;
    profilePic?: string;
  };
}

export type UserRole = 'student' | 'tutor' | 'admin';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
