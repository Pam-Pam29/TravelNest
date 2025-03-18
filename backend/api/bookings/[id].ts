// api/bookings/[id].ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../utils/dbConnect';
// Import your Booking model
import Booking from '../../src/models/Booking';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const booking = await Booking.findById(id);
        if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching booking' });
      }
      break;
    
    case 'PUT':
      try {
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBooking) {
          return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(updatedBooking);
      } catch (error) {
        res.status(500).json({ message: 'Error updating booking' });
      }
      break;
    
    case 'DELETE':
      try {
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
          return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting booking' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}