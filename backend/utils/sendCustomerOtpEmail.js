import { Resend } from 'resend';

export const sendCustomerOtpEmail = async (email, otp) => {
    const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
        throw new Error('Email provider configuration is missing');
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
        from,
        to: [email],
        subject: 'Your Sindhi Namkeen verification code',
        text: `Your verification code is ${otp}. It expires in 10 minutes. For your security, do not share this code with anyone.`,
        html: `<div style="font-family:Arial,sans-serif;color:#2d211b;max-width:560px;margin:0 auto;padding:28px"><h1 style="font-size:22px;margin-bottom:24px">Sindhi Namkeen &amp; Dry Fruits</h1><p style="font-size:16px">Your verification code</p><p style="font-size:34px;font-weight:700;letter-spacing:6px;margin:16px 0">${otp}</p><p>This code expires in <strong>10 minutes</strong>.</p><p style="font-size:14px;color:#665a53">For your security, never share this code with anyone. Our team will never ask you for it.</p></div>`,
    });

    if (error) {
        const safeField = (value) => {
            if (typeof value === 'number' && Number.isFinite(value)) return value;
            if (typeof value === 'string') return value.replace(/[\r\n]/g, '').slice(0, 100);
            return undefined;
        };
        const diagnostic = {
            name: safeField(error.name) || safeField(error.type),
            status: safeField(error.statusCode) ?? safeField(error.status),
            code: safeField(error.code),
        };
        console.warn(`[Resend send failure] ${JSON.stringify(diagnostic)}`);
        throw new Error('Email provider could not send the verification code');
    }
};