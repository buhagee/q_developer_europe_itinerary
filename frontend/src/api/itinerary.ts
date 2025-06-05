import api from './config';

export interface ItineraryItem {
  date: string;
  location: string;
  food?: string;
  activities?: string;
  accommodation?: string;
  travel?: string;
}

export const getItinerary = async (): Promise<ItineraryItem[]> => {
  try {
    const response = await api.get('/itinerary');
    return response.data;
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    throw error;
  }
};

export const getItineraryByDate = async (date: string): Promise<ItineraryItem> => {
  try {
    const response = await api.get(`/itinerary/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching itinerary for date ${date}:`, error);
    throw error;
  }
};

export const updateItinerary = async (date: string, data: Partial<ItineraryItem>): Promise<ItineraryItem> => {
  try {
    const response = await api.put(`/itinerary/${date}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating itinerary for date ${date}:`, error);
    throw error;
  }
};
