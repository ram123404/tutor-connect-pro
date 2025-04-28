
// User role types
export type UserRole = 'tutor' | 'student' | 'admin';

// Base User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string;
  createdAt: string;
  phoneNumber?: string;
  address?: {
    city: string;
    area: string;
  };
  subjects?: string[];
  experience?: number;
  availability?: string;
  monthlyFee?: number;
  bio?: string;
}

// Tutor Profile Interface
export interface TutorProfile extends User {
  address: {
    city: string;
    area: string;
  };
  subjects: string[];
  experience: number;
  availability: string;
  monthlyFee: number;
  bio?: string;
}

// Student Profile Interface
export interface StudentProfile extends User {
  phoneNumber: string;
  address: {
    city: string;
    area: string;
  };
}

// Tuition Request Interface
export interface TuitionRequest {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  gradeLevel: string;
  preferredDays: string[];
  preferredTimes: string[];
  duration: number; // in months
  startDate: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Booking Interface
export interface Booking {
  id: string;
  requestId: string;
  studentId: string;
  tutorId: string;
  subject: string;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  timeSlot: string;
  monthlyFee: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
