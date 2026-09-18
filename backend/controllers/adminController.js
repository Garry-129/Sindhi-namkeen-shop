import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET || 'sindhi_namkeen_rohtak_secret_key_2026', {
        expiresIn: '7d',
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
            // Fallback check against default credentials
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
