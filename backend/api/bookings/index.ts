// api/bookings/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../utils/dbConnect';
// Import your Booking model
import Booking from '../../src/models/Booking';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const bookings = await Booking.find({});
        res.status(200).json(bookings);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings' });
      }
      break;
    
    case 'POST':
      try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
      } catch (error) {
        res.status(500).json({ message: 'Error creating booking' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}