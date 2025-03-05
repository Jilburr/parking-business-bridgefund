import { apiService } from './apiService';
import { toastService } from './toastService';
import { API_ERRORS, SUCCESS_MESSAGES, PARKING_RATES } from '~/utils/constants';

// Define API response interface
export interface ApiResponseSessions {
  data: {
    parkingSessions: ApiParkingSessionRaw[];
  };
}
// Define API response session interface
export interface ApiParkingSessionRaw {
  parkingSessionId: string;
  vehicleType: string;
  vehicleLicensePlate: string;
  sessionStartedAt: string;
  sessionEndedAt: string | null;
  isSessionEnded: boolean;
  parkingSpaceId: number;
  sessionLengthInHoursMinutes: number;
}

// Define processed session interface with parsed dates
export interface ParkingSession {
  parkingSessionId: string;
  vehicleType: string;
  vehicleLicensePlate: string;
  sessionStartedAt: Date;
  sessionEndedAt: Date | null;
  isSessionEnded: boolean;
  parkingSpaceId: number;
  rate: number;
  sessionLengthInHoursMinutes: number;
}

export interface ApiResponseSpaces {
  data: {
    parkingSpaces: ApiParkingSpace[];
  };
}

export interface ApiParkingSpace {
  parkingSpaceId: number;
  isOccupied: boolean;
  occupancy: number;
  capacity: number;
  vehicleType: string;
}


/**
 * Service for parking-related API calls
 */
class ParkingService {
  /**
   * Get all parking spaces
   */
  async getSpaces(): Promise<ApiParkingSpace[]> {
    try {
      const response = await apiService.get<ApiResponseSpaces>('/parking/spaces/list');
      return response.data.parkingSpaces;
    } catch (error) {
    toastService.error(API_ERRORS.SESSION_FETCH_FAILED);
      console.error('Error fetching spaces:', error);
      return [];
    }
  }

  /**
   * Get all parking sessions
   */
  async getSessions(): Promise<ParkingSession[]> {
    try {
      const response = await apiService.get<ApiResponseSessions>('/parking/sessions/list');
      
      // Process and return the sessions
      return this.processSessions(response.data.parkingSessions);
    } catch (error) {
      toastService.error(API_ERRORS.SESSION_FETCH_FAILED);
      console.error('Error fetching sessions:', error);
      return [];
    }
  }
  
  /**
   * End a parking session
   */
  async endSession(parkingSessionId: string): Promise<boolean> {
    try {
      await apiService.post('/parking/session/end', {
        parkingSession: {
          id: parkingSessionId
        }
      });
      
      toastService.success(SUCCESS_MESSAGES.SESSION_ENDED);
      return true;
    } catch (error) {
      toastService.error(API_ERRORS.SESSION_END_FAILED);
      console.error('Error ending session:', error);
      return false;
    }
  }
  
  /**
   * Process raw sessions from API
   */
  
  private processSessions(rawSessions: ApiParkingSessionRaw[]): ParkingSession[] {
    return rawSessions.map((session: ApiParkingSessionRaw): ParkingSession => {
      // Parse dates and add rate
      return {
        ...session,
        sessionStartedAt: new Date(session.sessionStartedAt),
        sessionEndedAt: session.sessionEndedAt ? new Date(session.sessionEndedAt) : null,
        rate: this.getParkingRate(session.parkingSpaceId)
      };
    });
  }
  
  /**
   * Get parking rate based on space ID
   */
  private getParkingRate(parkingSpaceId: number): number {
    return PARKING_RATES[parkingSpaceId as keyof typeof PARKING_RATES] || 0;
  }
}

export const parkingService = new ParkingService(); 