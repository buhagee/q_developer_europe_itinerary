export interface ItineraryItem {
  date: string; // Format: DD/MM/YY
  location: string;
  food?: string;
  activities?: string;
  accommodation?: string;
  travel?: string;
}

export interface Note {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Place {
  id: string;
  name: string;
  city: string;
  type: PlaceType;
  description?: string;
  address?: string;
  openingHours?: string;
  website?: string;
  imageUrl?: string;
  rating?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export enum PlaceType {
  ATTRACTION = 'ATTRACTION',
  RESTAURANT = 'RESTAURANT',
  ACCOMMODATION = 'ACCOMMODATION',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER'
}
