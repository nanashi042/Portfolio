import fs from 'node:fs';
import path from 'node:path';
import { verifyPayment } from './verify-payment.js';

export default async function handler(request, response) {
  const verified = await verifyPayment(request);
  if (!verified) return response.status(403).json({ error: 'Payment verification required' });
  const archivePath = path.join(process.cwd(), 'private', 'memes-comedy-sfx.zip');
  if (!fs.existsSync(archivePath)) return response.status(404).json({ error: 'File unavailable' });
  response.setHeader('Content-Type', 'application/zip');
  response.setHeader('Content-Disposition', 'attachment; filename="memes-comedy-sfx.zip"');
  return response.status(200).send(fs.readFileSync(archivePath));
}
