export interface Token {
    auth: {
        accessToken: string;
        expiresIn: number;
    }
}

/**
 * Sets the bearer token in local storage
 * @param data - The token data containing value and expiration time
 */
export const setBearer = (data: Token) => {
    const token = {
        value: data.auth.accessToken,
        expiresAt: Date.now() / 1000 + data.auth.expiresIn
    }
    localStorage.setItem("authToken", JSON.stringify(token));
}