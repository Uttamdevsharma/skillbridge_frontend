export type Role = "STUDENT" | "TUTOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isBanned?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface TutorProfile {
  id: string;
  bio: string;
  hourlyRate: number;
  userId: string;
  user: User;
  tutorCategories: { category: Category }[];
  averageRating?: number;
  reviews?: Review[];
}

export interface AvailabilitySlot {
  id: string;
  tutorProfileId: string;
  categoryId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  category?: Category;
  tutor?: TutorProfile;
}

export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Booking {
  id: string;
  studentId: string;
  tutorProfileId: string;
  slotId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  student?: User;
  tutor?: TutorProfile;
  slot?: AvailabilitySlot;
  category?: Category;
  review?: Review;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  bookingId: string;
  studentId: string;
  tutorProfileId: string;
  createdAt: string;
  student?: User;
  tutor?: TutorProfile;
}

export interface AuthResponse {
  token: string;
  user: User;
}
