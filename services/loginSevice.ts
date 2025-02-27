import { apiService } from "./apiService";
import { toastService } from "./toastService";
import { API_ERRORS, SUCCESS_MESSAGES } from "~/utils/constants";
import { setBearer } from "~/utils/setBearer";
// Define API response interface for login
export interface ApiResponseLogin {
    auth: {
        accessToken: string;
        expiresIn: number;
    }
}

class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<ApiResponseLogin> {
    try {
      const response =
    	await apiService.postLogin<{ data: ApiResponseLogin }>("/auth/password", {
          email,
          password,
        });

		this.setToken(response.data);
		toastService.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
		return response.data;
    } catch (error) {
      toastService.error(API_ERRORS.GENERAL);
      console.error("Error logging in:", error);
      throw error;
    }
  }

  private setToken(data: ApiResponseLogin) {
	setBearer(data);
  }
}

export const loginService = new AuthService();
