import { jwtDecode } from 'jwt-decode';


export const isTokenValid = (token) => {
    try {
        if (!token) {
            return {
                valid: false,
                user: null,
                otpVerified: false,
                email: null,
            };
        }

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Check if token is expired
        if (decoded.exp <= currentTime) {
            localStorage.removeItem('token');
            return {
                valid: false,
                user: null,
                otpVerified: false,
                email: null,
            };
        }

        // Basic token structure validation
        if (!decoded.id ||  !decoded.email) {
            console.error('SECURITY WARNING: Token missing required fields');
            localStorage.removeItem('token');
            return {
                valid: false,
                user: null,
                otpVerified: false,
                email: null,
            };
        }
        return {
            valid: true,
            user: decoded.user || null,
            email: decoded.email || null,
            otpVerified: true,
        };
    }
    catch (error) {
        console.error('Token validation error:', error.message);
        localStorage.removeItem('token');

        return {
            valid: false,
            user: null,
            otpVerified: false,
            email: null,
        };
    }
}