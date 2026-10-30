import { verifyCashfreeOrder } from './cashfree.js';

export default async function handler(request, response) {
  const verified = await verifyCashfreeOrder(request.query.order_id);
  return response.status(verified ? 200 : 403).json({ verified });
}
