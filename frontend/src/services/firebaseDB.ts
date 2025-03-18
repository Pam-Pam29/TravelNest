// src/services/firebaseDB.ts
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

const firebaseConfig = {
  // same as authentication config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const firebaseDB = {
  async addPackage(packageData: any) {
    try {
      const docRef = await addDoc(collection(db, 'packages'), packageData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding package', error);
      throw error;
    }
  },

  async getPackages() {
    try {
      const q = query(collection(db, 'packages'), where(`price`, `>`, 100));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting packages', error);
      throw error;
    }
  }
};