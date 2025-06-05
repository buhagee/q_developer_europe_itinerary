import api from './config';

export interface Note {
  id: string;
  date: string;
  content: string;
  createdAt: string;
}

export const getNotes = async (date?: string): Promise<Note[]> => {
  try {
    const response = await api.get('/notes', {
      params: date ? { date } : undefined
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const createNote = async (date: string, content: string): Promise<Note> => {
  try {
    const response = await api.post('/notes', { date, content });
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};
