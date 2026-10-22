import React from 'react';

export type UserRole = 'customer' | 'provider';

export type TierLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  location: LocationCoords;
  createdAt: string;
  category?: string;
  bio?: string;
  basePrice?: number;
  rating?: number;
  totalJobs?: number;
  tier?: TierLevel | string;
  available?: boolean;
  photoURL?: string;
  totalEarnings?: number;
  jobsHistory?: string[];
}

export interface Provider {
  id?: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  category: string;
  city: string;
  location: LocationCoords;
  basePrice: number;
  rating: number;
  totalJobs: number;
  tier: TierLevel | string;
  bio: string;
  available?: boolean;
  photoURL?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id?: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  providerCategory: string;
  date: string;
  timeSlot: string;
  address: string;
  status: BookingStatus;
  totalPrice: number;
  distanceKm: number;
  customerRating?: number;
  reviewedAt?: string;
  notes?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  isSystem?: boolean;
}

export interface Category {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  text: string;
}

export interface PriceEstimateResult {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  estimatedHours: number;
  complexity: 'simple' | 'medium' | 'complex';
  explanation: string;
}

export interface AIRankingResult {
  providerId: string;
  score: number;
  reason: string;
}
