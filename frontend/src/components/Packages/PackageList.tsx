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

  async getPackageById(id: string): Promise<Package> {
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