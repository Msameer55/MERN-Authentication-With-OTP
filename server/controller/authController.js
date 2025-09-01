import User from "../model/userSchema.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

const createToken = (user) => {
    return jwt.sign({ userId: user._id, }, process.env.SECRET, { expiresIn: "1h" })
}

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }
    try {
        console.log(email, "access")
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ success: false, message: "Email already registered" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        const token = createToken(newUser);

        if (newUser.isAccountVerified) {
            return res.status(401).json({ success: false, message: "Account already verified" })
        }

        if (newUser.verifyOtp && newUser.verifyOtpExpiresAt > Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP already sent. Please wait before requesting a new one."
            });
        }


        const otp = String(Math.floor(100000 + Math.random() * 900000));
        newUser.verifyOtp = otp;
        newUser.verifyOtpExpiresAt = Date.now() + 5 * 60 * 1000;
        console.log("otp expires at", newUser.verifyOtpExpiresAt);

        await newUser.save();

        const { _id } = newUser

        const mailOptions = {
            from: `"Your App Name" <${process.env.SENDER_EMAIL}>`, // Use verified sender email
            to: email,
            subject: "Welcome To My Site",
            html: `
                <h2>Welcome to My Site!</h2>
                <p>Hi ${name},</p>
                <p>Welcome to my site! You have been successfully registered with the email: <strong>${email}</strong></p>
                <p>Thank you for joining us!</p>
                <br>
                <p>Best regards,<br>Your App Team</p>
            `,
            text: `Welcome to my site, ${name}! You have been registered with the email ${email}`
        };

        console.log("Sender email:", process.env.SENDER_EMAIL);
        console.log("SMTP user:", process.env.SMTP_USER);
        console.log("SMTP pass exists:", !!process.env.SMTP_PASS);
        console.log("Attempting to send email to:", email);

        // Send email with proper error handling
        try {
            console.log("About to send email...");
            const emailResult = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", emailResult.messageId);
            console.log("Email response:", emailResult.response);
        } catch (emailError) {
            console.error("=== EMAIL SENDING FAILED ===");
            console.error("Error message:", emailError.message);
            console.error("Error code:", emailError.code);
            console.error("Error response:", emailError.response);
            console.error("Error responseCode:", emailError.responseCode);
            console.error("Full error:", emailError);

            // Don't fail registration if email fails - just log the error
            console.log("Registration will continue despite email failure");
        }

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            token,
            user: {
                id: _id,
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (error) {
        console.log("inside catch")
        return res.status(400).json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Authentication Failed, Email Not Found" })
        }

        const comparePass = await bcryptjs.compare(password, user.password);

        if (!comparePass) {
            return res.status(401).json({ success: false, message: "Password must match" })
        }

        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                id: user._id,
                email: user.email
            }
        })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

// send verification otp to the user
export const sendVerifyOTP = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (user.isAccountVerified) {
            return res.status(401).json({ success: false, message: "Account already verified" })
        }

        if (user.verifyOtp && user.verifyOtpExpiresAt > Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP already sent. Please wait before requesting a new one."
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 1 * 60 * 1000;
        console.log("otp expires at", user.verifyOtpExpiresAt);

        await user.save();

        const mailOptions = {
            from: `"APP Name" <${process.env.SENDER_EMAIL}>`,
            to: user.email, // <-- you had a bug: email is not defined
            subject: "OTP Sent",
            html: `
                <h2>OTP</h2>
                <p>Hi ${user.name},</p>
                <p>Welcome to my site! Your OTP is: <strong>${otp}</strong></p>
                <p>Thank you for joining us!</p>
                <br>
                <p>Best regards,<br>Your App Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: "OTP Sent Successfully to your email" });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

// Verify email using otp
export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const userId = req.userId;

    if (!userId || !otp) {
        return res.status(401).json({ success: false, message: "Invalid Fields" })
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.status(401).json({ success: false, message: "Invalid OTP" })
        }

        if (user.verifyOtpExpiresAt < Date.now()) {
            return res.status(401).json({ success: false, message: "OTP has been Expired" })
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiresAt = 0;

        await user.save();
        return res.status(201).json({ success: true, message: "Email verified successfully" })

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message })
    }

}

export const resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(401).json({ success: false, message: "Please Enter the email to send otp" })
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }

        if (user.resetOtp && user.resetOtpExpiresAt > Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP already sent. Please wait before requesting a new one."
            });
        }

        const otp = String(Math.floor(1000000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() + 1 * 60 * 10000;

        await user.save();

        const mailOptions = {
            from: `"App Name" <${process.env.SENDER_EMAIL}>`,
            to: user.email, // <-- you had a bug: email is not defined
            subject: "OTP Reset",
            html: `
                <h2>Resent OTP</h2>
                <p>Hi ${user.name},</p>
                <p>Hey! You have requested for otp resent! Your OTP is: <strong>${otp}</strong></p>
                <p>Thank you for joining us!</p>
                <br>
                <p>Best regards,<br>Your App Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: "OTP Resent to your email" })


    } catch (error) {
        return res.status(401).json({ success: false, message: error.message })
    }
}

// Reset the password 
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(401).json({ success: false, message: "Email, OTP and New Password are required" })
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(401).json({ success: false, message: "Invalid OTP" })
        }

        if (user.resetOtpExpiresAt < Date.now()) {
            return res.status(401).json({ success: false, message: "OTP Expired" })
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpiresAt = 0;

        await user.save();


        const mailOptions = {
            from: `"App Name" <${process.env.SENDER_EMAIL}>`,
            to: user.email, // <-- you had a bug: email is not defined
            subject: "Password Reset OTP",
            html: `
                <h2>Password Changed</h2>
                <p>Hi ${user.name},</p>
                <p>Hey! You have requested for Password Reset</p>
                <p>Your password has been reset successfully</p>
                <p>Thank you for joining us!</p>
                <br>
                <p>Best regards,<br>Your App Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: "Password Reset Successfully" })

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message })
    }
}