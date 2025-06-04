import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import NoteIcon from '@mui/icons-material/Note';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Itinerary',
      description: 'View your complete travel schedule with all activities, accommodations, and transportation details.',
      icon: <CalendarMonthIcon fontSize="large" color="primary" />,
      path: '/itinerary'
    },
    {
      title: 'Places',
      description: 'Explore attractions, restaurants, and accommodations for each city on your journey.',
      icon: <PlaceIcon fontSize="large" color="primary" />,
      path: '/places'
    },
    {
      title: 'Notes',
      description: 'Add personal notes and reminders for each day of your trip.',
      icon: <NoteIcon fontSize="large" color="primary" />,
      path: '/notes'
    },
    {
      title: 'Map',
      description: 'Interactive map showing your travel route and key locations.',
      icon: <MapIcon fontSize="large" color="primary" />,
      path: '/map'
    },
    {
      title: 'Resources',
      description: 'Useful travel resources, local phrases, and emergency contacts.',
      icon: <InfoIcon fontSize="large" color="primary" />,
      path: '/resources'
    }
  ];

  return (
    <Box>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4, 
        p: 4, 
        borderRadius: 2,
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/europe-banner.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white'
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Europe Trip 2025
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          June 18 - August 3, 2025
        </Typography>
        <Typography variant="body1">
          Your personal travel companion for an unforgettable European adventure
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate(feature.path)}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Next Destination: Malta
        </Typography>
        <Typography variant="body1">
          Your adventure begins in 14 days!
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
