import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc,
  getDocs, 
  doc,
  getDoc,
  query,

  where
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Package } from '../../types/Package';

interface PackageFilters {
  minPrice?: number;
  maxPrice?: number;
  destination?: string;
}

// Define the service outside of the component
export const packageService = {
  async getAllPackages(filters?: PackageFilters): Promise<Package[]> {
    try {
      const packagesCollection = collection(db, 'packages');
      
      // Build query based on filters
      let q = query(packagesCollection);
      
      if (filters) {
        if (filters.minPrice !== undefined) {
          q = query(q, where('price', '>=', filters.minPrice));
        }
        
        if (filters.maxPrice !== undefined) {
          q = query(q, where('price', '<=', filters.maxPrice));
        }
        
        if (filters.destination) {
          q = query(q, where('destinations', 'array-contains', filters.destination));
        }
      }

      const packagesSnapshot = await getDocs(q);
      
      return packagesSnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        return {
          _id: docSnapshot.id,
          title: data.title || '',
          description: data.description || '',
          price: data.price || 0,
          duration: data.duration || 0,
          destinations: data.destinations || [],
          availability: data.availability || 0,
          images: data.images || [],
          includedServices: data.includedServices || []
        } as Package;
      });
    } catch (error) {
      console.error('Error fetching packages', error);
      throw error;
    }
  },

  // Keep the other methods from your original code
  async getPackageById(id: string): Promise<Package> {
    // Your existing code
    try {
      const packageDoc = doc(db, 'packages', id);
      const packageSnapshot = await getDoc(packageDoc);
      
      if (!packageSnapshot.exists()) {
        throw new Error('Package not found');
      }

      const data = packageSnapshot.data();
      return {
        _id: packageSnapshot.id,
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        duration: data.duration || 0,
        destinations: data.destinations || [],
        availability: data.availability || 0,
        images: data.images || [],
        includedServices: data.includedServices || []
      } as Package;
    } catch (error) {
      console.error('Error fetching package', error);
      throw error;
    }
  },

  async createPackage(packageData: Package): Promise<string> {
    // Your existing code
    try {
      const docRef = await addDoc(collection(db, 'packages'), {
        title: packageData.title,
        description: packageData.description,
        price: packageData.price,
        duration: packageData.duration,
        destinations: packageData.destinations,
        availability: packageData.availability,
        images: packageData.images,
        includedServices: packageData.includedServices
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating package', error);
      throw error;
    }
  }
};

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesData = await packageService.getAllPackages();
        setPackages(packagesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch packages');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPackages();
  }, []);

  if (loading) return <div>Loading packages...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="package-list-container">
      <h1>Available Travel Packages</h1>
      {packages.length === 0 ? (
        <p>No packages available at the moment.</p>
      ) : (
        <div className="package-grid">
          {packages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              <h3>{pkg.title}</h3>
              <p>{pkg.description}</p>
              <p>Price: ${pkg.price}</p>
              <p>Duration: {pkg.duration} days</p>
              <p>Availability: {pkg.availability} spots left</p>
              <button>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackageList;