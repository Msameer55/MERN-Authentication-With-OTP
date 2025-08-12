import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) return res.status(401).json({ success: false, message: "Authorization Failed! Token Not Found" })

    try {
        console.log("Verifying token...");
        const decoded = jwt.verify(token, process.env.SECRET); 
        console.log(decoded, "decoded user from middleware");

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
}