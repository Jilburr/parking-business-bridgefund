/**
 * Parking space types
 */
export const PARKING_SPACES = {
  RESIDENTIAL: 1,
  CAR: 2,
  MOTORCYCLE: 3
} as const;

/**
 * Parking space names
 */
export const PARKING_SPACE_NAMES = {
  [PARKING_SPACES.RESIDENTIAL]: 'Residential Parking',
  [PARKING_SPACES.CAR]: 'Car Parking',
  [PARKING_SPACES.MOTORCYCLE]: 'Motorcycle Parking'
} as const;

/**
 * Parking rates per hour
 */
export const PARKING_RATES = {
  [PARKING_SPACES.RESIDENTIAL]: 0,
  [PARKING_SPACES.CAR]: 5,
  [PARKING_SPACES.MOTORCYCLE]: 3
} as const;

/**
 * API error messages
 */
export const API_ERRORS = {
  GENERAL: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_END_FAILED: 'Failed to end the parking session.',
  SESSION_FETCH_FAILED: 'Failed to fetch parking sessions.'
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SESSION_ENDED: 'Parking session ended successfully.'
} as const; 