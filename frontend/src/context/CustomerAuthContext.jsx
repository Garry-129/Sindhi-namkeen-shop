import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
    const [customerToken, setCustomerToken] = useState(
        localStorage.getItem('sindhi_customer_token') || null
    );
    const [customerUser, setCustomerUser] = useState(() => {
        const saved = localStorage.getItem('sindhi_customer_user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const isCustomerAuthenticated = Boolean(customerToken);

    const loginCustomerContext = (token, user) => {
        setCustomerToken(token);
        setCustomerUser(user);
        localStorage.setItem('sindhi_customer_token', token);
        localStorage.setItem('sindhi_customer_user', JSON.stringify(user));
    };

    const logoutCustomerContext = () => {
        setCustomerToken(null);
        setCustomerUser(null);
        localStorage.removeItem('sindhi_customer_token');
        localStorage.removeItem('sindhi_customer_user');
    };

    const updateCustomerUser = (user) => {
        setCustomerUser(user);
        localStorage.setItem('sindhi_customer_user', JSON.stringify(user));
    };

    return (
        <CustomerAuthContext.Provider
            value={{
                customerToken,
                customerUser,
                isCustomerAuthenticated,
                loginCustomerContext,
                logoutCustomerContext,
                updateCustomerUser,
            }}
        >
            {children}
        </CustomerAuthContext.Provider>
    );
};

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (!context) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
    }
    return context;
};
