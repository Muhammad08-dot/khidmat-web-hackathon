import { describe, it, expect } from 'vitest';
import { getDistanceKm, calculateTravelFeePKR, estimateTravelTimeMinutes } from '../utils/location';

describe('Location Utility Functions', () => {
  it('calculates distance between two coordinate points', () => {
    // Lahore to Karachi is ~1020-1030 km
    const distance = getDistanceKm(31.5204, 74.3587, 24.8607, 67.0011);
    expect(distance).toBeGreaterThan(1000);
    expect(distance).toBeLessThan(1100);
  });

  it('calculates 0 km distance for identical coordinates', () => {
    const distance = getDistanceKm(31.5204, 74.3587, 31.5204, 74.3587);
    expect(distance).toBe(0);
  });

  it('calculates travel fee in PKR with base rate and distance surcharge', () => {
    // <= 1 km returns flat 100 PKR
    expect(calculateTravelFeePKR(0.5)).toBe(100);
    expect(calculateTravelFeePKR(1)).toBe(100);

    // 10 km -> 100 + 9*20 = 280 PKR
    expect(calculateTravelFeePKR(10)).toBe(280);
  });

  it('estimates travel time in minutes based on distance', () => {
    expect(estimateTravelTimeMinutes(0.2)).toBe(5);
    expect(estimateTravelTimeMinutes(5)).toBeGreaterThanOrEqual(15);
  });
});
