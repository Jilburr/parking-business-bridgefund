export interface AuthToken {
  value: string;
  expiresAt: number;
}

/**
 * Retrieves the bearer token from local storage
 * @returns {string|null} The bearer token if available and valid, null otherwise
 */
export const getBearer = (): string | null => {
  try {
    const authToken: string | null = localStorage.getItem('authToken');
    
    if (!authToken) {
      return null;
    }
    
    const token: AuthToken = JSON.parse(authToken);
    
    // Check if token exists and is not expired
    if (token && token.value && token.expiresAt > Date.now() / 1000) {
      return token.value;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving bearer token:', error);
    return null;
  }
};
