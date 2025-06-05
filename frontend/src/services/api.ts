import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getItinerary = async () => {
  try {
    const response = await api.get('/itinerary');
    return response.data;
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    throw error;
  }
};

export const getItineraryByDate = async (date: string) => {
  try {
    const response = await api.get(`/itinerary/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching itinerary for date ${date}:`, error);
    throw error;
  }
};

export const getNotes = async (date?: string) => {
  try {
    const response = await api.get('/notes', {
      params: date ? { date } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const createNote = async (date: string, content: string) => {
  try {
    const response = await api.post('/notes', { date, content });
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const getPlaces = async () => {
  try {
    const response = await api.get('/places');
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

export const getPlacesByCity = async (city: string) => {
  try {
    const response = await api.get(`/places/${city}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching places for city ${city}:`, error);
    throw error;
  }
};

export default api;
