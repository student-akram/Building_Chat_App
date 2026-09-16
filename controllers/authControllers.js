const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

// =========================
// SIGNUP
// =========================

exports.signup = async (req, res) => {

    try {

        let { name, email, phone, password } = req.body;

        // Remove unnecessary spaces
        name = name?.trim();
        email = email?.trim().toLowerCase();
        phone = phone?.trim();
        password = password?.trim();

        // Basic validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Check if phone already exists
        const existingPhone = await User.findOne({
            where: {
                phone: phone
            }
        });

        if (existingPhone) {
            return res.status(409).json({
                message: "Phone number already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        console.log("New user created:", {
            id: user.id,
            email: user.email
        });

        return res.status(201).json({
            message: "Signup successful"
        });

    } catch (error) {

        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Signup failed",
            error: error.message
        });
    }
};


// =========================
// LOGIN
// =========================

exports.login = async (req, res) => {

    try {

        let { loginInput, password } = req.body;

        loginInput = loginInput?.trim();
        password = password?.trim();

        if (!loginInput || !password) {
            return res.status(400).json({
                message: "Login details are required"
            });
        }

        // Normalize email if login input looks like an email
        const normalizedLoginInput = loginInput.toLowerCase();

        // Find user using email OR phone
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        email: normalizedLoginInput
                    },
                    {
                        phone: loginInput
                    }
                ]
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        console.log("Login successful:", user.email);

        return res.json({
            token,
            userId: user.id,
            email: user.email
        });

    } catch (error) {

        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};