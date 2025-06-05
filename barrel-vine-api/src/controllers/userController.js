const User = require('@models/User');
const asyncHandler = require('express-async-handler');
const tokenUtils = require('@middlewares/jwt');
const jwt = require('jsonwebtoken');
const { mailResetPassword } = require('@src/templates/resetPasswordEmail');
const env = require('@config/environment');
const sendMail = require('@utils/sendMail');
const crypto = require('crypto');

// [POST] register user
const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, mobile } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            mes: 'Missing input!',
        });
    }
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            mes: 'User already exists!',
        });
    } else {
        // Create new user
        const newUser = await User.create({
            email,
            password,
            firstName,
            lastName,
            mobile,
        });
        return res.status(201).json({
            success: newUser ? true : false,
            mes: newUser ? 'User created successfully!' : 'Failed to create user!',
        });
    }
});

// [POST] login user
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            mes: 'Missing input!',
        });
    }
    // Check if user exists
    const userResponse = await User.findOne({ email });
    if (!userResponse) {
        return res.status(400).json({
            success: false,
            mes: 'User not found!',
        });
    }
    // Check password (có sử dụng async method isCorrectPassword)
    const isMatch = await userResponse.isCorrectPassword(password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            mes: 'Invalid credentials!',
        });
    }
    // Token generation
    const accessToken = tokenUtils.generateAccessToken(userResponse._id, userResponse.role);
    const refreshToken = tokenUtils.generateRefreshToken(userResponse._id);
    // Save refresh token to user
    await User.findByIdAndUpdate(userResponse._id, { refreshToken }, { new: true });
    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Return user data (excluding password)
    const { password: _, role, ...userData } = userResponse.toObject();
    return res.status(200).json({
        success: true,
        accessToken,
        response: userData,
    });
});

// [GET] get user info
const getCurrentUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    // Fetch user details from database
    const userDetails = await User.findById(_id).select('-password -refreshToken -role');
    console.log(userDetails);
    if (!userDetails) {
        return res.status(404).json({
            success: false,
            mes: 'User not found!',
        });
    }
    return res.status(200).json({
        success: true,
        response: userDetails,
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy refresh token từ cookie
    const cookie = req.cookies;
    // Kiểm tra xem cookie có chứa refresh token không
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookies!');

    // Kiểm tra tính hợp lệ của refresh token
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET); // Nếu hết hạn sẽ tự động ném lỗi với hàm errorHandler
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken });
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
            ? tokenUtils.generateAccessToken(response._id, response.role)
            : 'Refresh token is not valid!',
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookies!');
    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true }
    );
    // Xóa cookie refresh token
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.status(200).json({
        success: true,
        mes: 'Logout successful!',
    });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.query; // Lấy email từ query string
    if (!email) throw new Error('Email is required!');
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found!');
    // Create password reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    const content = {
        subject: 'Forgot password notification from your Barrel&Vine account',
        html: mailResetPassword(resetToken),
        text: `You have requested to reset your password. Please use the following link: ${env.CLIENT_URL}/user/reset-password/${resetToken}`,
    };

    // Send email
    const rs = await sendMail(email, content);
    return res.status(200).json({
        success: true,
        mes: 'Reset password email sent successfully!',
        rs,
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!token) throw new Error('Token is required!');
    if (!password) throw new Error('Password is required!');
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error('Invalid or expired reset token!');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Password reset successfully!' : 'Failed to reset password!',
    });
});
module.exports = {
    register,
    login,
    getCurrentUser,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
};
