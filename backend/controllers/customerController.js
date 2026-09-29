import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomInt } from 'node:crypto';
import Customer from '../models/Customer.js';
import CustomerOtp from '../models/CustomerOtp.js';
import Order from '../models/Order.js';
import { sendCustomerOtpEmail } from '../utils/sendCustomerOtpEmail.js';

let fallbackCustomers = [];

const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'sindhi_namkeen_rohtak_secret_key_2026';
};

const generateCustomerToken = (id, email, name) => {
    return jwt.sign({ id, email, name, role: 'customer' }, getJwtSecret(), {
        expiresIn: '30d',
    });
};

const OTP_LIFETIME_MS = 10 * 60 * 1000;
const MAX_OTP_RESENDS = 3;
const MAX_OTP_ATTEMPTS = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => typeof email === 'string' ? email.trim().toLowerCase() : '';

const invalidOtpResponse = (res) => res.status(400).json({
    success: false,
    message: 'The verification code is invalid or expired. Request a new code and try again.',
});

// @desc    Send a customer verification code
// @route   POST /api/customers/request-otp
export const requestCustomerOtp = async (req, res) => {
    try {
        const emailAddress = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
        const email = normalizeEmail(emailAddress);
        if (!EMAIL_PATTERN.test(email)) {
            return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
        }

        const now = new Date();
        const current = await CustomerOtp.findOne({ email });
        if (current && current.expiresAt > now && now.getTime() - current.lastSentAt.getTime() < 60 * 1000) {
            return res.status(429).json({ success: false, message: 'Please wait before requesting another code.' });
        }
        if (current && current.expiresAt > now && current.resendCount >= MAX_OTP_RESENDS) {
            return res.status(429).json({ success: false, message: 'Too many code requests. Please try again later.' });
        }

        const otp = String(randomInt(0, 1_000_000)).padStart(6, '0');
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(now.getTime() + OTP_LIFETIME_MS);

        if (current && current.expiresAt > now) {
            const updated = await CustomerOtp.findOneAndUpdate(
                {
                    _id: current._id,
                    resendCount: { $lt: MAX_OTP_RESENDS },
                    expiresAt: { $gt: now },
                    lastSentAt: current.lastSentAt,
                },
                {
                    $set: { otpHash, expiresAt, attempts: 0, lastSentAt: now },
                    $inc: { resendCount: 1 },
                },
                { new: true }
            );
            if (!updated) {
                return res.status(429).json({ success: false, message: 'Too many code requests. Please try again later.' });
            }
        } else if (current) {
            const reset = await CustomerOtp.updateOne(
                { _id: current._id, expiresAt: { $lte: now } },
                { $set: { otpHash, expiresAt, attempts: 0, resendCount: 1, lastSentAt: now } }
            );
            if (reset.matchedCount !== 1) {
                return res.status(429).json({ success: false, message: 'Please wait before requesting another code.' });
            }
        } else {
            try {
                await CustomerOtp.create({ email, otpHash, expiresAt, attempts: 0, resendCount: 1, lastSentAt: now });
            } catch (error) {
                if (error.code !== 11000) throw error;
                return res.status(429).json({ success: false, message: 'Please wait before requesting another code.' });
            }
        }

        await sendCustomerOtpEmail(emailAddress, otp);
        return res.json({
            success: true,
            message: 'If this address can receive email, a verification code has been sent.',
            expiresInSeconds: OTP_LIFETIME_MS / 1000,
            resendAvailableInSeconds: 60,
        });
    } catch {
        return res.status(503).json({ success: false, message: 'Unable to send a verification code right now. Please try again later.' });
    }
};

// @desc    Verify a customer code and issue the existing customer JWT
// @route   POST /api/customers/verify-otp
export const verifyCustomerOtp = async (req, res) => {
    try {
        const email = normalizeEmail(req.body?.email);
        const otp = typeof req.body?.otp === 'string' ? req.body.otp : '';
        if (!EMAIL_PATTERN.test(email) || !/^\d{6}$/.test(otp)) {
            return invalidOtpResponse(res);
        }

        const now = new Date();
        const record = await CustomerOtp.findOne({ email, expiresAt: { $gt: now } });
        if (!record) return invalidOtpResponse(res);
        if (record.attempts >= MAX_OTP_ATTEMPTS) {
            return res.status(429).json({ success: false, message: 'Too many incorrect codes. Request a new code.' });
        }

        const attempt = await CustomerOtp.findOneAndUpdate(
            { _id: record._id, attempts: { $lt: MAX_OTP_ATTEMPTS }, expiresAt: { $gt: now } },
            { $inc: { attempts: 1 } },
            { new: true }
        );
        if (!attempt) return invalidOtpResponse(res);

        if (!(await bcrypt.compare(otp, record.otpHash))) {
            return invalidOtpResponse(res);
        }

        const consumed = await CustomerOtp.findOneAndDelete({
            _id: record._id,
            otpHash: record.otpHash,
            expiresAt: { $gt: new Date() },
        });
        if (!consumed) return invalidOtpResponse(res);

        let customer = await Customer.findOne({ email });
        if (!customer) {
            try {
                customer = await Customer.create({ email, addresses: [] });
            } catch (error) {
                if (error.code !== 11000) throw error;
                customer = await Customer.findOne({ email });
            }
        }
        if (!customer) throw new Error('Customer could not be loaded after verification');

        const token = generateCustomerToken(customer._id, customer.email, customer.name);
        return res.json({
            success: true,
            message: 'Email verified successfully.',
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                addresses: customer.addresses || [],
            },
        });
    } catch {
        return res.status(500).json({ success: false, message: 'Unable to verify the code right now. Please try again.' });
    }
};

// @desc    Get customer profile
// @route   GET /api/customers/me
export const getCustomerProfile = async (req, res) => {
    try {
        let customer = null;
        try {
            customer = await Customer.findById(req.customer.id).select('-password');
        } catch (dbErr) {
            customer = fallbackCustomers.find(c => c._id === req.customer.id);
        }

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer profile not found' });
        }

        res.json({
            success: true,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                addresses: customer.addresses || [],
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update customer profile
// @route   PUT /api/customers/me
export const updateCustomerProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        let customer = null;

        try {
            customer = await Customer.findById(req.customer.id);
            if (customer) {
                if (name) customer.name = name.trim();
                if (phone) customer.phone = phone.trim();
                await customer.save();
            }
        } catch (dbErr) {
            const index = fallbackCustomers.findIndex(c => c._id === req.customer.id);
            if (index !== -1) {
                if (name) fallbackCustomers[index].name = name.trim();
                if (phone) fallbackCustomers[index].phone = phone.trim();
                customer = fallbackCustomers[index];
            }
        }

        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                addresses: customer.addresses || [],
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add a saved address
// @route   POST /api/customers/addresses
export const addAddress = async (req, res) => {
    try {
        const { label, fullAddress, isDefault } = req.body;

        if (!fullAddress || !fullAddress.trim()) {
            return res.status(400).json({ success: false, message: 'Full delivery address is required' });
        }

        let updatedAddresses = [];

        try {
            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(404).json({ success: false, message: 'Customer not found' });
            }

            if (isDefault) {
                customer.addresses.forEach(addr => { addr.isDefault = false; });
            }

            customer.addresses.push({
                label: (label || 'Home').trim(),
                fullAddress: fullAddress.trim(),
                isDefault: isDefault || customer.addresses.length === 0,
            });

            await customer.save();
            updatedAddresses = customer.addresses;
        } catch (dbErr) {
            const customer = fallbackCustomers.find(c => c._id === req.customer.id);
            if (customer) {
                if (isDefault) {
                    customer.addresses.forEach(addr => { addr.isDefault = false; });
                }
                const newAddr = {
                    _id: `addr_${Date.now()}`,
                    label: (label || 'Home').trim(),
                    fullAddress: fullAddress.trim(),
                    isDefault: isDefault || customer.addresses.length === 0,
                };
                customer.addresses.push(newAddr);
                updatedAddresses = customer.addresses;
            }
        }

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addresses: updatedAddresses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Edit a saved address
// @route   PUT /api/customers/addresses/:id
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, fullAddress, isDefault } = req.body;

        let updatedAddresses = [];

        try {
            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(404).json({ success: false, message: 'Customer not found' });
            }

            const addrIndex = customer.addresses.findIndex(a => a._id.toString() === id);
            if (addrIndex === -1) {
                return res.status(404).json({ success: false, message: 'Address not found' });
            }

            if (isDefault) {
                customer.addresses.forEach(addr => { addr.isDefault = false; });
            }

            if (label) customer.addresses[addrIndex].label = label.trim();
            if (fullAddress) customer.addresses[addrIndex].fullAddress = fullAddress.trim();
            if (isDefault !== undefined) customer.addresses[addrIndex].isDefault = Boolean(isDefault);

            await customer.save();
            updatedAddresses = customer.addresses;
        } catch (dbErr) {
            const customer = fallbackCustomers.find(c => c._id === req.customer.id);
            if (customer) {
                const addrIndex = customer.addresses.findIndex(a => a._id === id);
                if (addrIndex !== -1) {
                    if (isDefault) customer.addresses.forEach(addr => { addr.isDefault = false; });
                    if (label) customer.addresses[addrIndex].label = label.trim();
                    if (fullAddress) customer.addresses[addrIndex].fullAddress = fullAddress.trim();
                    if (isDefault !== undefined) customer.addresses[addrIndex].isDefault = Boolean(isDefault);
                    updatedAddresses = customer.addresses;
                }
            }
        }

        res.json({
            success: true,
            message: 'Address updated successfully',
            addresses: updatedAddresses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a saved address
// @route   DELETE /api/customers/addresses/:id
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        let updatedAddresses = [];

        try {
            const customer = await Customer.findById(req.customer.id);
            if (!customer) {
                return res.status(404).json({ success: false, message: 'Customer not found' });
            }

            customer.addresses = customer.addresses.filter(a => a._id.toString() !== id);
            await customer.save();
            updatedAddresses = customer.addresses;
        } catch (dbErr) {
            const customer = fallbackCustomers.find(c => c._id === req.customer.id);
            if (customer) {
                customer.addresses = customer.addresses.filter(a => a._id !== id);
                updatedAddresses = customer.addresses;
            }
        }

        res.json({
            success: true,
            message: 'Address deleted successfully',
            addresses: updatedAddresses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders placed by logged-in customer
// @route   GET /api/customers/orders
export const getCustomerOrders = async (req, res) => {
    try {
        let orders = [];
        try {
            orders = await Order.find({
                $or: [
                    { customerId: req.customer.id },
                    { 'customer.phone': req.customer.phone },
                    { 'customer.email': req.customer.email }
                ]
            }).sort({ createdAt: -1 });
        } catch (dbErr) {
            // Memory search if DB not connected
            orders = [];
        }

        res.json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
