import { createCashfreeOrder } from './cashfree.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const { name, email, phone } = request.body || {};
  if (!name?.trim() || !email?.trim() || !/^\+?[0-9]{10,15}$/.test((phone || '').replace(/[\s()-]/g, ''))) {
    return response.status(400).json({ error: 'Enter your name, email, and a valid phone number.' });
  }
  try {
    const amount = Number(process.env.CASHFREE_SFX_PRICE_INR);
    if (!Number.isFinite(amount) || amount <= 0) {
      return response.status(500).json({ error: 'Store checkout is not configured yet.' });
    }
    const protocol = request.headers['x-forwarded-proto'] || 'https';
    const origin = `${protocol}://${request.headers.host}`;
    const orderId = `sfx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const order = await createCashfreeOrder({
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: orderId,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.replace(/[\s()-]/g, ''),
      },
      order_meta: { return_url: `${origin}/store/success?order_id={order_id}` },
      order_note: 'Memes & Comedy SFX pack',
    });
    if (!order?.payment_session_id) return response.status(502).json({ error: 'Could not start checkout. Please try again.' });
    return response.status(200).json({ orderId: order.order_id, paymentSessionId: order.payment_session_id });
  } catch {
    return response.status(502).json({ error: 'Could not start checkout. Please try again.' });
  }
}
