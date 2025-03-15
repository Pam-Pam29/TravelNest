import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageService } from '../../services/packageService';
import { bookingService } from '../../services/bookingService';
import { Package } from '../../types/Package';

const PackageDetails: React.FC = () => {
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [bookingError, setBookingError] = useState('');

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    if (!id) {
      setError('No package ID provided');
      setLoading(false);
      return;
    }

    try {
      const packageDetails = await packageService.getPackageById(id);
      setPkg(packageDetails);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch package details');
      setLoading(false);
      console.error(err);
    }
  };

  const handleBookPackage = async () => {
    if (!id) {
      setBookingError('Invalid package');
      return;
    }

    try {
      // You might want to add a date picker for travel date in a real app
      const booking = await bookingService.createBooking({
        packageId: id,
        travelDate: new Date(), // Default to current date
        numberOfTravelers: travelers
      });

      // Redirect to dashboard or booking confirmation
      navigate('/dashboard');
    } catch (err) {
      const error = err as any;
      setBookingError(error.response?.data?.message || 'Booking failed');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading package details...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!pkg) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          {pkg.images && pkg.images.length > 0 ? (
            <img 
              src={pkg.images[0]} 
              alt={pkg.title} 
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              No Image Available
            </div>
          )}
        </div>

        {/* Package Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{pkg.title}</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{pkg.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Destinations: {pkg.destinations.join(', ')}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Duration: {pkg.duration} days</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Price: ${pkg.price.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span>Availability: {pkg.availability} spots left</span>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Book Your Trip</h2>
            
            <div className="flex items-center mb-4">
              <label htmlFor="travelers" className="mr-4">Number of Travelers:</label>
              <input 
                type="number" 
                id="travelers"
                min="1"
                max={pkg.availability}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-20 border rounded px-2 py-1"
              />
            </div>

            <div className="flex items-center mb-4">
              <span className="mr-4">Total Price:</span>
              <span className="font-bold text-blue-600">
                ${(pkg.price * travelers).toFixed(2)}
              </span>
            </div>

            {bookingError && (
              <div className="text-red-500 mb-4">{bookingError}</div>
            )}

            <button 
              onClick={handleBookPackage}
              disabled={pkg.availability < travelers}
              className={`w-full py-3 rounded text-white font-semibold ${
                pkg.availability < travelers 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {pkg.availability < travelers 
                ? 'Not Enough Availability' 
                : 'Book Now'}
            </button>
          </div>

          {/* Included Services */}
          {pkg.includedServices && pkg.includedServices.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Included Services</h2>
              <ul className="list-disc list-inside">
                {pkg.includedServices.map((service, index) => (
                  <li key={index} className="text-gray-600">{service}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;

