require('dotenv').config({ path: "../.env" });

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;

const register = async (req, res) => {
    try {
        const { username, email, password, phone, address } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email hoặc số điện thoại đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            address,
        });

        await newUser.save();

        return res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({ 
            message: "Đăng nhập thành công", 
            token, 
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address,
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

const logout = async (req, res) => {
    try {
        return res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

module.exports = {
    register,
    login,
    logout
}