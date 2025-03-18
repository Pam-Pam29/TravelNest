import { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  res.status(200).json([
    { id: 1, title: "Test Package 1", price: 999, destinations: ["Test City"] },
    { id: 2, title: "Test Package 2", price: 1299, destinations: ["Another City"] }
  ]);
}