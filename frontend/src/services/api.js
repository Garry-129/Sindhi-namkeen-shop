import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to append admin or customer token if present
api.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem('sindhi_admin_token');
    const customerToken = localStorage.getItem('sindhi_customer_token');

    if (config.url && config.url.includes('/admin')) {
        if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (config.url && config.url.includes('/customers')) {
        if (customerToken) config.headers.Authorization = `Bearer ${customerToken}`;
    } else {
        if (customerToken) config.headers.Authorization = `Bearer ${customerToken}`;
        else if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
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
        const errorData = err.response?.data || { message: 'Login failed' };
        if (err.response?.status) {
            errorData.status = err.response.status;
        }
        throw errorData;
    }
};

export const changePasswordApi = async (passwordData) => {
    try {
        const res = await api.put('/admin/change-password', passwordData);
        return res.data;
    } catch (err) {
        const errorData = err.response?.data || { message: 'Failed to change password' };
        if (err.response?.status) {
            errorData.status = err.response.status;
        }
        throw errorData;
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

// Customer API Services
export const customerRegisterApi = async (customerData) => {
    try {
        const res = await api.post('/customers/register', customerData);
        return res.data;
    } catch (err) {
        const errorData = err.response?.data || { message: 'Customer registration failed' };
        if (err.response?.status) errorData.status = err.response.status;
        throw errorData;
    }
};

export const customerLoginApi = async (credentials) => {
    try {
        const res = await api.post('/customers/login', credentials);
        return res.data;
    } catch (err) {
        const errorData = err.response?.data || { message: 'Customer login failed' };
        if (err.response?.status) errorData.status = err.response.status;
        throw errorData;
    }
};

export const fetchCustomerProfileApi = async () => {
    try {
        const res = await api.get('/customers/me');
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch customer profile' };
    }
};

export const updateCustomerProfileApi = async (profileData) => {
    try {
        const res = await api.put('/customers/me', profileData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to update profile' };
    }
};

export const addCustomerAddressApi = async (addressData) => {
    try {
        const res = await api.post('/customers/addresses', addressData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to add address' };
    }
};

export const updateCustomerAddressApi = async (id, addressData) => {
    try {
        const res = await api.put(`/customers/addresses/${id}`, addressData);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to update address' };
    }
};

export const deleteCustomerAddressApi = async (id) => {
    try {
        const res = await api.delete(`/customers/addresses/${id}`);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to delete address' };
    }
};

export const fetchCustomerOrdersApi = async () => {
    try {
        const res = await api.get('/customers/orders');
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch customer orders' };
    }
};

export default api;
