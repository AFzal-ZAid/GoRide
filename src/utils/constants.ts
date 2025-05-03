// API and backend URLs
export const API_URL = 'http://localhost:5000';

// Default map coordinates (New York City)
export const DEFAULT_COORDINATES = {
  lat: 40.7128,
  lng: -74.0060,
};

// Ride status options
export const RIDE_STATUSES = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Fare calculation constants
export const FARE_CONSTANTS = {
  BASE_FARE: 2.5,
  PER_MILE_RATE: 1.75,
  PER_MINUTE_RATE: 0.25,
  MINIMUM_FARE: 7.0,
};