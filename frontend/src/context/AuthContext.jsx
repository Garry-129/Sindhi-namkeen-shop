import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [adminToken, setAdminToken] = useState(() => localStorage.getItem('sindhi_admin_token') || null);
    const [adminUser, setAdminUser] = useState(() => {
        try {
            const user = localStorage.getItem('sindhi_admin_user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    });

    const loginAdminContext = (token, user) => {
        setAdminToken(token);
        setAdminUser(user);
        localStorage.setItem('sindhi_admin_token', token);
        localStorage.setItem('sindhi_admin_user', JSON.stringify(user));
    };

    const logoutAdminContext = () => {
        setAdminToken(null);
        setAdminUser(null);
        localStorage.removeItem('sindhi_admin_token');
        localStorage.removeItem('sindhi_admin_user');
    };

    return (
        <AuthContext.Provider
            value={{
                adminToken,
                adminUser,
                isAuthenticated: Boolean(adminToken),
                loginAdminContext,
                logoutAdminContext,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
