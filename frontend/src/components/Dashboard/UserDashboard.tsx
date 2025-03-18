// src/components/Dashboard/UserDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/Booking';

const UserDashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userBookings = await bookingService.getUserBookings();
      setBookings(userBookings);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      setLoading(false);
      console.error(err);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      // Refresh bookings after cancellation
      fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, { 'Traveler'}</h1>
        <button 
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            You have no bookings yet. 
            <a href="/packages" className="text-blue-500 ml-2 hover:underline">
              Explore Packages
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">
                    {booking.package.title}
                  </h3>
                  <p className="text-gray-600">
                    Travel Date: {new Date(booking.travelDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`
                      ${booking.status === 'Cancelled' ? 'text-red-500' : 'text-green-500'}
                    `}>
                      {booking.status}
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-blue-600">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                  {booking.status !== 'Cancelled' && (
                    <button 
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
