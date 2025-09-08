import User from "../model/userSchema.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

const createToken = (user) => {
    return jwt.sign( { id: user._id, email: user.email, isVerified: user.isAccountVerified }, process.env.SECRET, { expiresIn: "1h" })
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
            verifyOtpExpiresAt: Date.now() + 5 * 60 * 1000,
            isAccountVerified: false
        })
        // const token = createToken(newUser);

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

        const mailOptions = {
            from: `"Your App Name" <${process.env.SENDER_EMAIL}>`, // Use verified sender email
            to: email,
            subject: "Welcome To My Site",
            html: `
                <h2>Welcome to My Site!</h2>
                <p>Hi ${name},</p>
                <p>Welcome to my site! You have been successfully registered with the email: <strong>${email}</strong></p>
                <p>The OTP for registration is : <strong>${otp}</strong></p>
                <p>The OTP will expire in 5 minutes</p>
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
            // token,
            user: {
                id: newUser._id,
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
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and Password required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: "Email not found" });

        const match = await bcryptjs.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: "Incorrect password" });

        if (!user.isAccountVerified) return res.status(403).json({ success: false, message: "Account not verified. Please verify OTP first." });

        // Token now includes isVerified
        const token = createToken(user)
        

        return res.status(200).json({ success: true, message: "Login successful", token, user: { id: user._id, email: user.email } });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};





// Verify email using otp
export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const user = await User.findOne({ email });

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

        return res.status(201).json({ success: true, message: "OTP verified successfully, you can now login" })

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message })
    }

}

export const resendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Please enter your email" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account is already verified" });
        }

        // Prevent spamming OTP requests
        if (user.verifyOtp && user.verifyOtpExpiresAt > Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP already sent. Please wait before requesting a new one."
            });
        }

        // Generate new OTP (6 digits)
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 5 * 60 * 1000; // expires in 5 minutes

        await user.save();

        const mailOptions = {
            from: `"App Name" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Resend OTP - Verify Your Email",
            html: `
                <h2>Resent OTP</h2>
                <p>Hi ${user.name},</p>
                <p>You have requested a new OTP. Your OTP is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 5 minutes.</p>
                <br>
                <p>Best regards,<br>Your App Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


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