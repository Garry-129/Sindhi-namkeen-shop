import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
        console.warn('WARNING: JWT_SECRET environment variable is not defined!');
    }
    return secret || 'sindhi_namkeen_rohtak_secret_key_2026';
};

const generateToken = (id, username) => {
    return jwt.sign({ id, username }, getJwtSecret(), {
        expiresIn: '7d', // 7 days token expiry
    });
};

// @desc    Admin login
// @route   POST /api/admin/login
export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
        const defaultAdminPass = process.env.ADMIN_PASSWORD || 'admin123';

        let isAdminValid = false;
        let adminId = 'admin_1';

        try {
            const admin = await Admin.findOne({ username });
            if (admin && (await admin.matchPassword(password))) {
                isAdminValid = true;
                adminId = admin._id;
            }
        } catch (err) {
            // Fallback check against default credentials if DB connection fails
            if (username === defaultAdminUser && password === defaultAdminPass) {
                isAdminValid = true;
            }
        }

        // Direct fallback check if DB hasn't been seeded yet
        if (!isAdminValid && username === defaultAdminUser && password === defaultAdminPass) {
            isAdminValid = true;
        }

        if (!isAdminValid) {
            return res.status(401).json({ success: false, message: 'Invalid admin username or password' });
        }

        const token = generateToken(adminId, username);

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                id: adminId,
                username,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify admin token
// @route   GET /api/admin/me
export const verifyAdmin = async (req, res) => {
    res.json({
        success: true,
        admin: req.admin,
    });
};

// @desc    Change admin password (Protected)
// @route   PUT /api/admin/change-password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const username = req.admin?.username || 'admin';

        let adminUpdated = false;

        try {
            const admin = await Admin.findOne({ username });
            if (admin) {
                const isMatch = await admin.matchPassword(currentPassword);
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
                }
                admin.password = newPassword; // Triggers pre('save') bcrypt hashing in Admin.js
                await admin.save();
                adminUpdated = true;
            }
        } catch (dbErr) {
            console.warn('[Admin Controller] DB update error, using fallback password logic:', dbErr.message);
        }

        if (!adminUpdated) {
            // Fallback check against environment or memory admin
            const defaultAdminPass = process.env.ADMIN_PASSWORD || 'admin123';
            if (currentPassword !== defaultAdminPass) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }
            // Update in-memory password for fallback mode
            process.env.ADMIN_PASSWORD = newPassword;
        }

        res.json({
            success: true,
            message: 'Admin password updated successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
