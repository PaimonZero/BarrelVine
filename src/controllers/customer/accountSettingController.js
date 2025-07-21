const User = require('@models/User');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get account setting page for customer
 * @route   GET /account-setting
 * @access  Private
 */
const getAccountSettingPage = asyncHandler(async (req, res) => {
    const userDetails = await User.findById(req.user._id).select('-password -refreshToken -role');
    if (userDetails) {
        userDetails.fullName = userDetails.lastName + ' ' + userDetails.firstName;
    }

    const notification = req.session.notification;
    delete req.session.notification;

    res.render('customer/account-setting', {
        title: 'Account Setting',
        account: req.user || null,
        notification: notification || null,
        userDetails,
    });
});

/**
 * @desc    Update account settings for customer
 * @route   POST /account-setting
 * @access  Private
 */
const updateAccountSettings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { firstName, lastName, email, mobile, address } = req.body;

    if (!firstName || !lastName || !mobile) {
        const userDetails = await User.findById(_id).select('-password -refreshToken -role');
        userDetails.fullName = userDetails.lastName + ' ' + userDetails.firstName;

        req.session.notification = {
            message: 'Vui lòng điền đầy đủ các trường bắt buộc để tiếp tục nhé!',
            type: 'danger',
        };

        const backURL = req.get('Referer') || '/';
        return res.redirect(backURL);
    }

    const updateFields = {
        firstName,
        lastName,
        email,
        mobile,
        address,
    };

    if (req.file) {
        updateFields.avatar = req.file.path;
    }

    // Cập nhật user trong DB
    const updatedUser = await User.findByIdAndUpdate(_id, updateFields, { new: true, runValidators: true });

    // Tạo lại accessToken mới với thông tin vừa cập nhật
    const accessToken = await require('@middlewares/jwt').generateAccessToken(
        updatedUser._id,
        updatedUser.role,
        updatedUser.firstName,
        updatedUser.avatar,
        updatedUser.lastName,
        updatedUser.mobile
    );

    // Set lại cookie accessToken
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1 * 60 * 60 * 1000,
        secure: false,
        path: '/',
    });

    // Làm mới lại req.user cho request hiện tại
    req.user = {
        _id: updatedUser._id,
        role: updatedUser.role,
        firstName: updatedUser.firstName,
        avatar: updatedUser.avatar,
        lastName: updatedUser.lastName,
        mobile: updatedUser.mobile,
        email: updatedUser.email,
    };

    req.session.notification = {
        message: 'Bạn đã cập nhật tài khoản thành công!',
        type: 'success',
    };
    res.redirect('/account-setting');
});

/**
 * @desc    Update customer password
 * @route   POST /account-setting/change-password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const userDetailsForRender = await User.findById(_id).select('-password -refreshToken -role');
    if (userDetailsForRender) {
        userDetailsForRender.fullName =
            userDetailsForRender.lastName + ' ' + userDetailsForRender.firstName;
    }

    const renderWithMsg = (type, message) => {
        res.render('customer/account-setting', {
            title: 'Account Setting',
            account: req.user || null,
            userDetails: userDetailsForRender,
            notification: {
                message,
                type,
            },
        });
    };

    if (!oldPassword || !newPassword || !confirmPassword) {
        return renderWithMsg('danger', 'Vui lòng điền đầy đủ các trường mật khẩu.');
    }

    if (newPassword !== confirmPassword) {
        return renderWithMsg('danger', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
    }

    const user = await User.findById(_id);
    const isMatch = await user.isCorrectPassword(oldPassword);

    if (!isMatch) {
        return renderWithMsg('danger', 'Mật khẩu cũ không chính xác.');
    }

    user.password = newPassword;
    await user.save();

    return renderWithMsg('success', 'Chúc mừng bạn đã cập nhật mật khẩu thành công nhé!');
});

module.exports = {
    getAccountSettingPage,
    updateAccountSettings,
    updatePassword,
};
