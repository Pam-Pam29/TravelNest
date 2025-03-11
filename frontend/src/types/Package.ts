export interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  destinations: string[];
  availability: number;
  images: string[];
  includedServices: string[];
}

