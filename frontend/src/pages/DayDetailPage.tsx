import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Button, 
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import { format, parse } from 'date-fns';

// Mock data - replace with API calls
const mockItineraryItems = {
  '18/06/25': {
    date: '18/06/25',
    location: 'Malta',
    food: '',
    activities: '',
    accommodation: 'Airbnb - Miami apartments Dragonara Rd, Paceville San Julian, STJ 3141',
    travel: 'Flight A: Syd 9:10pm -> DXB 5:40AM + 1 day, Flight B: DXB 7:55am -> LCA 11am, Flight C: LCA 12:15pm -> MLA 2:00pm'
  },
  '19/06/25': {
    date: '19/06/25',
    location: 'Malta',
    food: '',
    activities: 'Valletta, St. Johns Co-Cathedral and Upper Barrakka Gardens, Mdina and three Cities',
    accommodation: 'Airbnb - Miami apartments Dragonara Rd, Paceville San Julian, STJ 3141',
    travel: ''
  },
};

const mockNotes = [
  { id: '1', date: '18/06/25', content: 'Remember to exchange currency at the airport', createdAt: '2025-05-01T10:30:00Z' },
  { id: '2', date: '18/06/25', content: 'Pack adapter for European outlets', createdAt: '2025-05-02T14:20:00Z' },
];

interface ItineraryItem {
  date: string;
  location: string;
  food?: string;
  activities?: string;
  accommodation?: string;
  travel?: string;
}

interface Note {
  id: string;
  date: string;
  content: string;
  createdAt: string;
}

const DayDetailPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [dayData, setDayData] = useState<ItineraryItem | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setError('Invalid date parameter');
      setLoading(false);
      return;
    }

    // In a real app, fetch from API
    // const fetchDayData = async () => {
    //   try {
    //     const response = await fetch(`API_URL/itinerary/${date}`);
    //     const data = await response.json();
    //     setDayData(data);
    //     
    //     const notesResponse = await fetch(`API_URL/notes?date=${date}`);
    //     const notesData = await notesResponse.json();
    //     setNotes(notesData);
    //   } catch (err) {
    //     setError('Failed to load day data');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchDayData();

    // Using mock data for now
    setTimeout(() => {
      const foundItem = Object.values(mockItineraryItems).find(item => item.date === date);
      if (date && foundItem) {
        setDayData(foundItem);
        setNotes(mockNotes.filter(note => note.date === date));
      } else {
        setError('Day not found');
      }
      setLoading(false);
    }, 500);
  }, [date]);

  const formatDate = (dateString: string) => {
    try {
      const parsedDate = parse(dateString, 'dd/MM/yy', new Date());
      return format(parsedDate, 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !date) return;
    
    // In a real app, send to API
    // const addNote = async () => {
    //   try {
    //     const response = await fetch('API_URL/notes', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ date, content: newNote }),
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
      date: date,
      content: newNote,
      createdAt: new Date().toISOString(),
    };
    
    setNotes([...notes, newNoteObj]);
    setNewNote('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !dayData) {
    return (
      <Box>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/itinerary')}
          sx={{ mb: 2 }}
        >
          Back to Itinerary
        </Button>
        <Alert severity="error">
          {error || 'Day data not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/itinerary')}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {formatDate(dayData.date)}
        </Typography>
      </Box>

      <Chip 
        icon={<PlaceIcon />} 
        label={dayData.location} 
        color="primary" 
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {/* Itinerary Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Day Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {dayData.activities && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Activities</Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {dayData.activities}
                </Typography>
              </Box>
            )}

            {dayData.accommodation && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HotelIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Accommodation</Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {dayData.accommodation}
                </Typography>
              </Box>
            )}

            {dayData.travel && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FlightIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Travel</Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {dayData.travel}
                </Typography>
              </Box>
            )}

            {dayData.food && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <RestaurantIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Food</Typography>
                </Box>
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {dayData.food}
                </Typography>
              </Box>
            )}

            {!dayData.activities && !dayData.accommodation && !dayData.travel && !dayData.food && (
              <Typography variant="body1" color="text.secondary">
                No details available for this day.
              </Typography>
            )}
          </Paper>

          {/* Location Image */}
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="300"
              image={`https://source.unsplash.com/800x600/?${dayData.location}`}
              alt={dayData.location}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {dayData.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore the beautiful sights and culture of {dayData.location}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Notes Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a note for this day..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddNote}
                disabled={!newNote.trim()}
              >
                Add Note
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {notes.length > 0 ? (
              notes.map((note) => (
                <Card key={note.id} sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="body1">
                      {note.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No notes for this day yet.
              </Typography>
            )}
          </Paper>

          {/* Weather Widget Placeholder */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weather Forecast
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Weather information will be available closer to your trip date.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DayDetailPage;
