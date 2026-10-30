import https from 'node:https';

function razorpayRequest(path) {
  return new Promise((resolve, reject) => {
    const request = https.request(`https://api.razorpay.com${path}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}` },
    }, (response) => {
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve({ statusCode: response.statusCode || 500, body: JSON.parse(body) }));
    });
    request.on('error', reject);
    request.end();
  });
}

export async function verifyPayment(request) {
  const { payment_link_id: linkId, payment_id: paymentId } = request.query;
  if (!linkId || !paymentId || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return false;
  }
  try {
    const result = await razorpayRequest(`/v1/payment_links/${encodeURIComponent(linkId)}/payments`);
    const payment = result.body.items?.find((item) => item.id === paymentId);
    const verified = result.statusCode === 200 && Boolean(payment) && payment.status === 'captured';
    return verified;
  } catch {
    return false;
  }
}

export default async function handler(request, response) {
  const verified = await verifyPayment(request);
  return response.status(verified ? 200 : 403).json({ verified });
}
