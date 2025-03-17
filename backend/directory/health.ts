import { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'OK',
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}