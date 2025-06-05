import api from './config';

export interface Place {
  id: string;
  name: string;
  city: string;
  type: string;
  description?: string;
  address?: string;
  openingHours?: string;
  website?: string;
  imageUrl?: string;
  rating?: number;
}

export const getPlaces = async (): Promise<Place[]> => {
  try {
    const response = await api.get('/places');
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

export const getPlacesByCity = async (city: string): Promise<Place[]> => {
  try {
    const response = await api.get(`/places/${city}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching places for city ${city}:`, error);
    throw error;
  }
};

export const createPlace = async (placeData: Omit<Place, 'id'>): Promise<Place> => {
  try {
    const response = await api.post('/places', placeData);
    return response.data;
  } catch (error) {
    console.error('Error creating place:', error);
    throw error;
  }
};
