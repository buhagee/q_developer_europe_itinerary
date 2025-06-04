import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format, parse } from 'date-fns';

// Mock data - replace with API call
const mockNotes = [
  { id: '1', date: '18/06/25', content: 'Remember to exchange currency at the airport', createdAt: '2025-05-01T10:30:00Z' },
  { id: '2', date: '18/06/25', content: 'Pack adapter for European outlets', createdAt: '2025-05-02T14:20:00Z' },
  { id: '3', date: '21/06/25', content: 'Check if London Eye tickets need to be booked in advance', createdAt: '2025-05-03T09:15:00Z' },
  { id: '4', date: '25/06/25', content: 'Louvre Museum entry at 12pm - arrive 30 minutes early', createdAt: '2025-05-04T16:45:00Z' },
];

// Mock itinerary data for date selection
const mockItinerary = [
  { date: '18/06/25', location: 'Malta' },
  { date: '19/06/25', location: 'Malta' },
  { date: '20/06/25', location: 'Malta' },
  { date: '21/06/25', location: 'London' },
  { date: '22/06/25', location: 'London' },
  { date: '23/06/25', location: 'London' },
  { date: '24/06/25', location: 'Paris' },
  { date: '25/06/25', location: 'Paris' },
  { date: '26/06/25', location: 'Paris' },
];

interface Note {
  id: string;
  date: string;
  content: string;
  createdAt: string;
}

interface ItineraryDay {
  date: string;
  location: string;
}

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  useEffect(() => {
    // In a real app, fetch from API
    // const fetchData = async () => {
    //   try {
    //     const notesResponse = await fetch('API_URL/notes');
    //     const notesData = await notesResponse.json();
    //     setNotes(notesData);
    //     
    //     const itineraryResponse = await fetch('API_URL/itinerary');
    //     const itineraryData = await itineraryResponse.json();
    //     setItineraryDays(itineraryData);
    //   } catch (err) {
    //     setError('Failed to load data');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchData();

    // Using mock data for now
    setTimeout(() => {
      setNotes(mockNotes);
      setItineraryDays(mockItinerary);
      setLoading(false);
    }, 500);
  }, []);

  const handleDateChange = (event: SelectChangeEvent) => {
    setSelectedDate(event.target.value);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedDate) return;
    
    // In a real app, send to API
    // const addNote = async () => {
    //   try {
    //     const response = await fetch('API_URL/notes', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ date: selectedDate, content: newNote }),
    //     });
    //     const data = await response.json();
    //     setNotes([...notes, data]);
    //     setNewNote('');
    //   } catch (err) {
    //     console.error('Failed to add note:', err);
    //   }
    // };
    
    // addNote();

    // Using mock data for now
    const newNoteObj = {
      id: `${Date.now()}`,
      date: selectedDate,
      content: newNote,
      createdAt: new Date().toISOString(),
    };
    
    setNotes([...notes, newNoteObj]);
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    // In a real app, send to API
    // const deleteNote = async () => {
    //   try {
    //     await fetch(`API_URL/notes/${id}`, {
    //       method: 'DELETE',
    //     });
    //     setNotes(notes.filter(note => note.id !== id));
    //   } catch (err) {
    //     console.error('Failed to delete note:', err);
    //   }
    // };
    
    // deleteNote();

    // Using mock data for now
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) return;
    
    // In a real app, send to API
    // const updateNote = async () => {
    //   try {
    //     const response = await fetch(`API_URL/notes/${id}`, {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ content: editContent }),
    //     });
    //     const data = await response.json();
    //     setNotes(notes.map(note => note.id === id ? { ...note, content: editContent } : note));
    //     setEditingNote(null);
    //     setEditContent('');
    //   } catch (err) {
    //     console.error('Failed to update note:', err);
    //   }
    // };
    
    // updateNote();

    // Using mock data for now
    setNotes(notes.map(note => note.id === id ? { ...note, content: editContent } : note));
    setEditingNote(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parse(dateString, 'dd/MM/yy', new Date());
      return format(date, 'EEE, MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Travel Notes
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add New Note
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="date-select-label">Select Date</InputLabel>
              <Select
                labelId="date-select-label"
                id="date-select"
                value={selectedDate}
                label="Select Date"
                onChange={handleDateChange}
              >
                <MenuItem value="">
                  <em>Select a date</em>
                </MenuItem>
                {itineraryDays.map((day) => (
                  <MenuItem key={day.date} value={day.date}>
                    {formatDate(day.date)} - {day.location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Add a travel note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddNote}
              disabled={!newNote.trim() || !selectedDate}
              fullWidth
            >
              Add Note
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Your Notes
      </Typography>

      {notes.length === 0 ? (
        <Alert severity="info">
          You haven't added any notes yet. Add your first note above!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} md={6} key={note.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" color="primary">
                      {formatDate(note.date)}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditNote(note)}
                        disabled={editingNote === note.id}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteNote(note.id)}
                        disabled={editingNote === note.id}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  {editingNote === note.id ? (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => handleSaveEdit(note.id)}
                        disabled={!editContent.trim()}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="text" 
                        size="small" 
                        onClick={() => setEditingNote(null)}
                        sx={{ ml: 1 }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body1">
                      {note.content}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Added: {new Date(note.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default NotesPage;
