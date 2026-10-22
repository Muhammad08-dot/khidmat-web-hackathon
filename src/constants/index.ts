import { 
  Zap, 
  Droplet, 
  Hammer, 
  Paintbrush, 
  Snowflake, 
  Sparkles, 
  Settings, 
  Car, 
  Sprout, 
  Truck, 
  Bug, 
  Eye, 
  Flame, 
  Layers, 
  Wrench, 
  Camera, 
  Video, 
  Scissors, 
  Key, 
  Wind, 
  Cpu 
} from 'lucide-react';
import type { Category, TierLevel, LocationCoords } from '../types';

export const PAKISTAN_CITIES: Record<string, LocationCoords> = {
  "Karachi": { lat: 24.8607, lng: 67.0011 },
  "Lahore": { lat: 31.5204, lng: 74.3587 },
  "Islamabad": { lat: 33.6844, lng: 73.0479 },
  "Faisalabad": { lat: 31.4504, lng: 73.1350 },
  "Rawalpindi": { lat: 33.5651, lng: 73.0169 },
  "Peshawar": { lat: 34.0151, lng: 71.5249 },
  "Multan": { lat: 30.1575, lng: 71.5249 },
  "Quetta": { lat: 30.1798, lng: 66.9750 },
  "Sialkot": { lat: 32.4945, lng: 74.5229 },
  "Gujranwala": { lat: 32.1877, lng: 74.1945 }
};

export const TIER_CONFIG: Record<TierLevel, {
  name: TierLevel;
  badgeStyles: string;
  minJobs: number;
  minRating: number;
}> = {
  Platinum: {
    name: 'Platinum',
    badgeStyles: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none shadow-md font-extrabold tracking-wide uppercase animate-pulse',
    minJobs: 50,
    minRating: 4.8
  },
  Gold: {
    name: 'Gold',
    badgeStyles: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/20 font-bold',
    minJobs: 25,
    minRating: 4.5
  },
  Silver: {
    name: 'Silver',
    badgeStyles: 'bg-slate-300/20 text-slate-700 dark:text-slate-300 border-slate-300/30 dark:border-slate-300/20 font-semibold',
    minJobs: 10,
    minRating: 4.0
  },
  Bronze: {
    name: 'Bronze',
    badgeStyles: 'bg-[#CD7F32]/10 text-[#CD7F32] dark:text-[#E0A96D] border-[#CD7F32]/30 dark:border-[#CD7F32]/20 font-medium',
    minJobs: 0,
    minRating: 0
  }
};

export const CATEGORIES: Category[] = [
  { name: "Electrician", icon: Zap, color: "bg-primary-container/10", text: "text-primary dark:text-primary-fixed" },
  { name: "Plumber", icon: Droplet, color: "bg-secondary-container/10", text: "text-secondary dark:text-secondary-fixed" },
  { name: "Carpenter", icon: Hammer, color: "bg-tertiary-container/10", text: "text-tertiary dark:text-tertiary-fixed" },
  { name: "Painter", icon: Paintbrush, color: "bg-primary-container/10", text: "text-primary dark:text-primary-fixed" },
  { name: "AC Technician", icon: Snowflake, color: "bg-secondary-container/10", text: "text-secondary dark:text-secondary-fixed" },
  { name: "House Cleaner", icon: Sparkles, color: "bg-tertiary-container/10", text: "text-tertiary dark:text-tertiary-fixed" },
  { name: "Appliance Repair", icon: Settings, color: "bg-primary-container/10", text: "text-primary dark:text-primary-fixed" },
  { name: "Mechanic", icon: Car, color: "bg-secondary-container/10", text: "text-secondary dark:text-secondary-fixed" },
  { name: "Gardener", icon: Sprout, color: "bg-tertiary-container/10", text: "text-tertiary dark:text-tertiary-fixed" },
  { name: "Movers & Packers", icon: Truck, color: "bg-primary-container/10", text: "text-primary dark:text-primary-fixed" },
  { name: "Pest Control", icon: Bug, color: "bg-secondary-container/10", text: "text-secondary dark:text-secondary-fixed" },
  { name: "CCTV Technician", icon: Eye, color: "bg-tertiary-container/10", text: "text-tertiary dark:text-tertiary-fixed" },
  { name: "Welder", icon: Flame, color: "bg-primary-container/10", text: "text-primary dark:text-primary-fixed" },
  { name: "Mason", icon: Layers, color: "bg-secondary-container/10", text: "text-secondary dark:text-secondary-fixed" },
  { name: "Handyman", icon: Wrench, color: "bg-tertiary-container/10", text: "text-tertiary dark:text-tertiary-fixed" },
  { name: "Photographer", icon: Camera, color: "bg-primary-container/10", text: "text-primary dark:text-primary-fixed" },
  { name: "Videographer", icon: Video, color: "bg-secondary-container/10", text: "text-secondary dark:text-secondary-fixed" },
  { name: "Tailor", icon: Scissors, color: "bg-tertiary-container/10", text: "text-tertiary dark:text-tertiary-fixed" },
  { name: "Locksmith", icon: Key, color: "bg-primary-container/10", text: "text-primary dark:text-primary-fixed" },
  { name: "Solar Technician", icon: Wind, color: "bg-secondary-container/10", text: "text-secondary dark:text-secondary-fixed" },
  { name: "IT & Network Repair", icon: Cpu, color: "bg-tertiary-container/10", text: "text-tertiary dark:text-tertiary-fixed" }
];

export const TRAVEL_PRICING = {
  baseFeePKR: 100,
  ratePerKmPKR: 20
};
