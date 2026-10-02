const getWhatsAppNumberDigits = () => {
    const raw = import.meta.env.VITE_WHATSAPP_NUMBER || '';
    return String(raw).replace(/\D/g, '');
};

const buildWhatsAppOrderMessage = (cart, { itemsSubtotal, deliveryCharge, grandTotal }) => {
    const itemLines = (cart || [])
        .map((item) => {
            const variant = item.weightOption ? ` (${item.weightOption})` : '';
            const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
            return `• ${item.name}${variant} × ${item.quantity} — ₹${item.price} each = ₹${lineTotal}`;
        })
        .join('\n');

    const deliveryText = deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`;

    return `Hello! I would like to place an order from Sindhi Namkeen & Dry Fruits.

Items:
${itemLines}

Subtotal: ₹${itemsSubtotal}
Delivery: ${deliveryText}
Order total: ₹${grandTotal}

Please confirm this order.`;
};

const buildWhatsAppChatUrl = (text) => {
    const digits = getWhatsAppNumberDigits();
    if (!digits) return '';
    if (!text) return `https://wa.me/${digits}`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

const buildWhatsAppOrderUrl = (cart, totals) => {
    const message = buildWhatsAppOrderMessage(cart, totals);
    return buildWhatsAppChatUrl(message);
};

export {
    getWhatsAppNumberDigits,
    buildWhatsAppOrderMessage,
    buildWhatsAppChatUrl,
    buildWhatsAppOrderUrl,
};
