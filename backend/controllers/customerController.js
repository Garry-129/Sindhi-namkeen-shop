import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';

let fallbackCustomers = [];

const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'sindhi_namkeen_rohtak_secret_key_2026';
};

const generateCustomerToken = (id, email, name) => {
    return jwt.sign({ id, email, name, role: 'customer' }, getJwtSecret(), {
        expiresIn: '30d',
    });
};

// @desc    Register a new customer
// @route   POST /api/customers/register
export const registerCustomer = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'Name, email, password, and phone number are required' });
        }

        const cleanEmail = email.toLowerCase().trim();

        let existingCustomer = null;
        try {
            existingCustomer = await Customer.findOne({ email: cleanEmail });
        } catch (dbErr) {
            existingCustomer = fallbackCustomers.find(c => c.email === cleanEmail);
        }

        if (existingCustomer) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists' });
        }

        let newCustomer;
        try {
            newCustomer = await Customer.create({
                name: name.trim(),
                email: cleanEmail,
                password,
                phone: phone.trim(),
                addresses: [],
            });
        } catch (err) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            newCustomer = {
                _id: `cust_${Date.now()}`,
                name: name.trim(),
                email: cleanEmail,
                password: hashedPassword,
                phone: phone.trim(),
                addresses: [],
                createdAt: new Date().toISOString(),
                matchPassword: async function (p) { return await bcrypt.compare(p, this.password); }
            };
            fallbackCustomers.push(newCustomer);
        }

        const token = generateCustomerToken(newCustomer._id, newCustomer.email, newCustomer.name);

        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            token,
            customer: {
                id: newCustomer._id,
                name: newCustomer.name,
                email: newCustomer.email,
                phone: newCustomer.phone,
                addresses: newCustomer.addresses || [],
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Customer login
// @route   POST /api/customers/login
export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const cleanEmail = email.toLowerCase().trim();

        let customer = null;
        try {
            customer = await Customer.findOne({ email: cleanEmail });
        } catch (dbErr) {
            customer = fallbackCustomers.find(c => c.email === cleanEmail);
        }

        if (!customer) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        let isMatch = false;
        if (typeof customer.matchPassword === 'function') {
            isMatch = await customer.matchPassword(password);
        } else {
            isMatch = await bcrypt.compare(password, customer.password);
        }

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateCustomerToken(customer._id, customer.email, customer.name);

        res.json({
            success: true,
            message: 'Customer logged in successfully',
            token,
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
