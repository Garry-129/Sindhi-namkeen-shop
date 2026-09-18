import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to append admin token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sindhi_admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchProducts = async (params = {}) => {
    try {
        const res = await api.get('/products', { params });
        return res.data;
    } catch (err) {
        console.warn('API connection failed, returning null for fallback');
        return null;
    }
};

export const fetchProductById = async (id) => {
    try {
        const res = await api.get(`/products/${id}`);
        return res.data;
    } catch (err) {
        return null;
    }
};

export const createOrderApi = async (orderData) => {
    try {
        const res = await api.post('/orders', orderData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to create order' };
    }
};

export const adminLoginApi = async (credentials) => {
    try {
        const res = await api.post('/admin/login', credentials);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Login failed' };
    }
};

export const fetchAdminOrders = async () => {
    try {
        const res = await api.get('/orders');
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch orders' };
    }
};

export const updateOrderStatusApi = async (id, status) => {
    try {
        const res = await api.put(`/orders/${id}/status`, { status });
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to update order status' };
    }
};

export const createProductApi = async (productData) => {
    try {
        const res = await api.post('/products', productData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to create product' };
    }
};

export const updateProductApi = async (id, productData) => {
    try {
        const res = await api.put(`/products/${id}`, productData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to update product' };
    }
};

export const deleteProductApi = async (id) => {
    try {
        const res = await api.delete(`/products/${id}`);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to delete product' };
    }
};

export const seedDatabaseApi = async () => {
    try {
        const res = await api.post('/seed');
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to seed database' };
    }
};

export const trackOrderApi = async ({ orderNumber, phone }) => {
    try {
        let url = '/orders/track';
        if (orderNumber) {
            url = `/orders/track/${encodeURIComponent(orderNumber)}`;
        } else if (phone) {
            url = `/orders/track?phone=${encodeURIComponent(phone)}`;
        }
        const res = await api.get(url);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to track order' };
    }
};


export default api;
