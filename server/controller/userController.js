import User from "../model/userSchema.js";

export const getUserData = async (req, res) => {

    const userId = req.userId

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found "
            })
        }

        return res.status(201).json({
            success: true,
            message: "Successfully get user details",
            id: userId, email: user.email, isAccountVerified : user.isAccountVerified
        })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }

}