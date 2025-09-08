import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
    try {
        if (!token) return { valid: false, userId: null, email: null, isVerified: false };

        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp <= currentTime) {
            localStorage.removeItem('token');
            return { valid: false, userId: null, email: null, isVerified: false };
        }

        return {
            valid: true,
            userId: decoded.id || null,
            email: decoded.email || null,
            isVerified: decoded.isVerified || false
        };
    } catch (error) {
        localStorage.removeItem('token');
        return { valid: false, userId: null, email: null, isVerified: false };
    }
};
