import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const localData = localStorage.getItem('sindhi_cart');
            return localData ? JSON.parse(localData) : [];
        } catch {
            return [];
        }
    });

    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem('sindhi_cart', JSON.stringify(cart));
        } catch (e) {
            console.error(e);
        }
    }, [cart]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const calculateWeightMultiplier = (weightOption) => {
        if (!weightOption) return 1;
        if (weightOption.toLowerCase() === '500g') return 2;
        if (weightOption.toLowerCase() === '1kg') return 4;
        return 1; // Default 250g base price
    };

    const addToCart = (product, selectedWeight = '250g', quantity = 1) => {
        const multiplier = calculateWeightMultiplier(selectedWeight);
        const unitPrice = product.price * multiplier;
        const cartItemId = `${product._id}_${selectedWeight}`;

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex].quantity += quantity;
                return updated;
            } else {
                return [
                    ...prevCart,
                    {
                        cartItemId,
                        productId: product._id,
                        name: product.name,
                        category: product.category,
                        price: unitPrice,
                        basePrice: product.price,
                        weightOption: selectedWeight,
                        quantity,
                        imageUrl: product.imageUrl,
                    },
                ];
            }
        });

        showToast(`Added ${product.name} (${selectedWeight}) to cart!`);
    };

    const removeFromCart = (cartItemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId, delta) => {
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.cartItemId === cartItemId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const itemsSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Delivery rule: Free delivery above ₹500, flat ₹30 otherwise for Rohtak
    const deliveryCharge = cart.length === 0 ? 0 : itemsSubtotal >= 500 ? 0 : 30;
    const grandTotal = itemsSubtotal + deliveryCharge;
    const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                itemsSubtotal,
                deliveryCharge,
                grandTotal,
                totalItemCount,
                toastMessage,
                showToast,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
