import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import { format, parse } from 'date-fns';

// Mock data - replace with API call
const mockItinerary = [
  {
    date: '18/06/25',
    location: 'Malta',
    food: '',
    activities: '',
    accommodation: 'Airbnb - Miami apartments Dragonara Rd, Paceville San Julian, STJ 3141',
    travel: 'Flight A: Syd 9:10pm -> DXB 5:40AM + 1 day, Flight B: DXB 7:55am -> LCA 11am, Flight C: LCA 12:15pm -> MLA 2:00pm'
  },
  {
    date: '19/06/25',
    location: 'Malta',
    food: '',
    activities: 'Valletta, St. Johns Co-Cathedral and Upper Barrakka Gardens, Mdina and three Cities',
    accommodation: '',
    travel: ''
  },
  // Add more days...
];

interface ItineraryItem {
  date: string;
  location: string;
  food?: string;
  activities?: string;
  accommodation?: string;
  travel?: string;
}

const ItineraryPage: React.FC = () => {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, fetch from API
    // const fetchItinerary = async () => {
    //   try {
    //     const response = await fetch('API_URL/itinerary');
    //     const data = await response.json();
    //     setItinerary(data);
    //   } catch (err) {
    //     setError('Failed to load itinerary data');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchItinerary();

    // Using mock data for now
    setTimeout(() => {
      setItinerary(mockItinerary);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = parse(dateString, 'dd/MM/yy', new Date());
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleDayClick = (date: string) => {
    navigate(`/itinerary/${date}`);
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
        Your Europe Itinerary
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        June 18 - August 3, 2025
      </Typography>

      <List sx={{ width: '100%', bgcolor: 'background.paper', mt: 2 }}>
        {itinerary.map((day, index) => (
          <Paper 
            key={day.date} 
            elevation={1} 
            sx={{ 
              mb: 2, 
              overflow: 'hidden',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.01)',
                boxShadow: 2
              }
            }}
          >
            <ListItemButton onClick={() => handleDayClick(day.date)}>
              <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {formatDate(day.date)}
                  </Typography>
                  <Chip 
                    icon={<PlaceIcon />} 
                    label={day.location} 
                    color="primary" 
                    size="small" 
                  />
                </Box>
                
                <Divider sx={{ width: '100%', my: 1 }} />
                
                <Box sx={{ width: '100%' }}>
                  {day.activities && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon color="action" sx={{ mr: 1 }} />
                      <ListItemText 
                        primary="Activities" 
                        secondary={day.activities} 
                      />
                    </Box>
                  )}
                  
                  {day.accommodation && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <HotelIcon color="action" sx={{ mr: 1 }} />
                      <ListItemText 
                        primary="Accommodation" 
                        secondary={day.accommodation} 
                      />
                    </Box>
                  )}
                  
                  {day.travel && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FlightIcon color="action" sx={{ mr: 1 }} />
                      <ListItemText 
                        primary="Travel" 
                        secondary={day.travel} 
                      />
                    </Box>
                  )}
                  
                  {day.food && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <RestaurantIcon color="action" sx={{ mr: 1 }} />
                      <ListItemText 
                        primary="Food" 
                        secondary={day.food} 
                      />
                    </Box>
                  )}
                </Box>
              </ListItem>
            </ListItemButton>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default ItineraryPage;
