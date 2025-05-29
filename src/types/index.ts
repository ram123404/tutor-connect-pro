
export interface User {
  _id: string;
  id: string; // Add id property for compatibility
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  profilePic?: string;
  isBlocked?: boolean;
  createdAt?: string;
  gradeLevel?: string;
  subjects?: string[];
  learningGoals?: string;
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

export interface Booking {
  _id: string;
  id: string;
  tuitionRequest: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  tutor: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  timeSlot: string;
  monthlyFee: number;
  status: 'active' | 'completed' | 'cancelled';
  extended: boolean;
  extensionHistory: Array<{
    previousEndDate: Date;
    newEndDate: Date;
    extendedOn: Date;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  profilePic?: string;
  gradeLevel?: string;
  subjects?: string[];
  learningGoals?: string;
}
