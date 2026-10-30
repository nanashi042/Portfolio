import https from 'node:https';

const apiVersion = '2023-08-01';

function cashfreeRequest(path, method = 'GET', body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const request = https.request(`https://api.cashfree.com/pg${path}`, {
      method,
      headers: {
        'x-client-id': process.env.CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        'x-api-version': apiVersion,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    }, (response) => {
      let responseBody = '';
      response.on('data', (chunk) => { responseBody += chunk; });
      response.on('end', () => {
        try {
          resolve({ statusCode: response.statusCode || 500, body: responseBody ? JSON.parse(responseBody) : {} });
        } catch {
          resolve({ statusCode: response.statusCode || 500, body: {} });
        }
      });
    });
    request.on('error', reject);
    if (payload) request.write(payload);
    request.end();
  });
}

export async function createCashfreeOrder(order) {
  if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) return null;
  const response = await cashfreeRequest('/orders', 'POST', order);
  return response.statusCode === 200 ? response.body : null;
}

export async function verifyCashfreeOrder(orderId) {
  if (!orderId || !process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) return false;
  try {
    const response = await cashfreeRequest(`/orders/${encodeURIComponent(orderId)}`);
    const configuredAmount = Number(process.env.CASHFREE_SFX_PRICE_INR);
    return response.statusCode === 200
      && response.body.order_status === 'PAID'
      && response.body.order_currency === 'INR'
      && Number(response.body.order_amount) === configuredAmount
      && orderId.startsWith('sfx_');
  } catch {
    return false;
  }
}
