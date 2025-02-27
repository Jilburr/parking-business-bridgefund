import { toastService } from './toastService';

/**
 * Base API service with common functionality
 */
class ApiService {
  private config = useRuntimeConfig();
  
  /**
   * Get the base URL for API requests
   */
  private getBaseUrl(): string {
    return this.config.public.apiBase;
  }
  
  /**
   * Get common headers for API requests
   */
  private getHeaders(contentType = 'application/json', isLogin = false): HeadersInit {
    const token = getBearer();

    if (isLogin) {
      return {
        'Content-Type': contentType,
      };
    }
    
    if (!token) {
      // Redirect to login if no token
      navigateTo('/login');
      throw new Error('No authentication token available');
    }
    
    return {
      'Content-Type': contentType,
      'Authorization': `Bearer ${token}`
    };
  }
  
  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      toastService.error(API_ERRORS.UNAUTHORIZED);
      navigateTo('/login');
    } else if (error.message && error.message.includes('network')) {
      toastService.error(API_ERRORS.NETWORK);
    } else {
      toastService.error(API_ERRORS.GENERAL);
    }
    
    throw error;
  }
  
  /**
   * Make a GET request
   */
  
  async get<T>(endpoint: string): Promise<T> {
    try {
      return await $fetch<T>(`${this.getBaseUrl()}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  /**
   * Make a authenticated POST request
   */
  async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      return await $fetch<T>(`${this.getBaseUrl()}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make a login POST request
   */
  async postLogin<T>(endpoint: string, body: any): Promise<T> {
    try {
      return await $fetch<T>(`${this.getBaseUrl()}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders('application/json', true),
        body
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
}


export const apiService = new ApiService(); 