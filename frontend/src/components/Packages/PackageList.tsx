import React, { useState, } from 'react';
import { Link } from 'react-router-dom';
import { packageService } from '../../services/packageService';
import { Package } from '../../types/Package';

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [destination, setDestination] = useState('');



  const fetchPackages = async () => {
    try {
      setLoading(true);
      const fetchedPackages = await packageService.getAllPackages({
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        destination: destination || undefined
      });
      setPackages(fetchedPackages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch packages');
      setLoading(false);
      console.error(err);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPackages();
  };

  if (loading) return <div className="text-center py-10">Loading packages...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Packages</h1>

      {/* Filters */}
      <form onSubmit={handleFilterSubmit} className="mb-6 flex space-x-4">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Filter
        </button>
      </form>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="text-center text-gray-500">No packages found</div>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg._id} 
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src={pkg.images[0] || '/placeholder-image.jpg'} 
                alt={pkg.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{pkg.title}</h2>
                <p className="text-gray-600 mb-2">
                  {pkg.destinations.join(', ')}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">
                    ${pkg.price}
                  </span>
                  <Link 
                    to={`/packages/${pkg._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PackageList;