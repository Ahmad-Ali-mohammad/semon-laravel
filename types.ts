
import React from 'react';

export type UserRole = 'admin' | 'manager' | 'editor' | 'user';

export interface ReptileSpecification {
  label: string;
  value: string;
}

export interface ReptileReview {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Reptile {
  id: number;
  name: string;
  species: string;
  description?: string;
  price: number;
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
  status: 'متوفر' | 'قيد الحجز' | 'غير متوفر';
  category: 'snake' | 'lizard' | 'turtle';
  specifications?: ReptileSpecification[];
  reviews?: ReptileReview[];
  careInstructions?: string;
}

export interface Supply {
  id: number;
  name: string;
  category: 'food' | 'housing' | 'heating' | 'decoration' | 'cleaning' | 'health' | 'accessories';
  description?: string;
  price: number;
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
  status: 'متوفر' | 'غير متوفر';
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  active: boolean;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: 'تعليمي' | 'أخبار' | 'نصائح طبية';
  date: string;
  author: string;
  image: string;
  isActive: boolean;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  price?: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string;
  price?: string;
  highlight?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: string;
  date: string;
}

export interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

export interface CustomCategory {
  id: number;
  value: string;
  label: string;
}

export interface CustomSpecies {
  id: number;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  passwordHash?: string;
  passwordSalt?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  keyMasked?: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export type BackupType = 'full' | 'products' | 'orders' | 'customers' | 'settings';
export type BackupStatus = 'completed' | 'in_progress' | 'failed' | 'pending';

export interface Backup {
  id: string;
  name: string;
  size: string;
  date: string;
  type: BackupType;
  status: BackupStatus;
  description?: string;
  restoredAt?: string;
}

export interface BackupSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retention: number;
}

export type ReportType = 'sales' | 'products' | 'customers' | 'orders' | 'inventory' | 'financial' | 'marketing' | 'performance';

export interface OrderItem {
  reptileId: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName?: string;
  phone?: string;
  city?: string;
  address?: string;
  notes?: string;
  date: string;
  status: 'قيد المعالجة' | 'تم الشحن' | 'تم التوصيل' | 'تم التأكيد';
  total: number;
  items: OrderItem[];
  paymentConfirmationImage?: string;
  paymentMethod?: 'card' | 'shamcash';
  paymentVerificationStatus: 'قيد المراجعة' | 'مقبول' | 'مرفوض';
  rejectionReason?: string;
}

export interface ShamCashConfig {
  barcodeImageUrl: string;
  accountCode: string;
  isActive: boolean;
  accountHolderName: string;
  phoneNumber: string;
  paymentInstructions: string;
}

export interface CartItem extends Reptile {
  quantity: number;
}

export interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export interface NotificationSettings {
  orders: boolean;
  promotions: boolean;
  system: boolean;
  messages: boolean;
}

export interface PromotionalCard {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  discountPercentage?: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  targetCategory?: 'snake' | 'lizard' | 'turtle' | 'all';
  buttonText?: string;
  buttonLink?: string;
}

export interface PolicyDocument {
  id: string;
  type: 'privacy' | 'returns' | 'warranty' | 'terms' | 'shipping' | 'custom';
  title: string;
  content: string;
  lastUpdated: string;
  isActive: boolean;
  icon?: string;
}

export interface FilterOption {
  id: string;
  name: string;
  value: string;
  isActive: boolean;
  order: number;
}

export interface FilterGroup {
  id: string;
  name: string;
  type: 'category' | 'price' | 'availability' | 'custom';
  options: FilterOption[];
  isActive: boolean;
  appliesTo: 'products' | 'supplies' | 'both';
}

export interface Preference {
  id: string;
  theme: string;
  language: string;
  notifications_enabled: boolean;
  currency: string;
  tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  maintenance_mode: boolean;
  allow_guest_checkout: boolean;
  require_email_verification: boolean;
  default_user_role: string;
}

export interface CompanyInfo {
  name: string;
  nameEnglish: string;
  description: string;
  foundedYear: number;
  mission: string;
  vision: string;
  story: string;
  logoUrl?: string;
  mascotUrl?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  workingHours: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
  isActive: boolean;
}
