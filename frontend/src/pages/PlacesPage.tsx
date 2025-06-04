import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// Mock data - replace with API call
const mockPlaces = [
  {
    id: '1',
    name: 'St. Johns Co-Cathedral',
    city: 'Malta',
    type: 'ATTRACTION',
    description: 'Baroque cathedral with ornate interior and Caravaggio paintings',
    address: 'St John Street, Valletta, Malta',
    openingHours: '9:30 AM - 4:30 PM',
    website: 'https://www.stjohnscocathedral.com/',
    imageUrl: 'https://source.unsplash.com/800x600/?cathedral,malta',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Buckingham Palace',
    city: 'London',
    type: 'ATTRACTION',
    description: 'Official residence of the British monarch',
    address: 'Westminster, London SW1A 1AA, UK',
    openingHours: 'Summer opening: 9:30 AM - 5:30 PM',
    website: 'https://www.rct.uk/visit/buckingham-palace',
    imageUrl: 'https://source.unsplash.com/800x600/?buckingham,palace',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Louvre Museum',
    city: 'Paris',
    type: 'ATTRACTION',
    description: 'World\'s largest art museum and historic monument',
    address: 'Rue de Rivoli, 75001 Paris, France',
    openingHours: '9:00 AM - 6:00 PM, Closed on Tuesdays',
    website: 'https://www.louvre.fr/en',
    imageUrl: 'https://source.unsplash.com/800x600/?louvre,paris',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Carette',
    city: 'Paris',
    type: 'RESTAURANT',
    description: 'Classic Parisian café known for pastries and macarons',
    address: '4 Place du Trocadéro et du 11 Novembre, 75016 Paris, France',
    openingHours: '7:30 AM - 11:30 PM',
    website: 'https://www.carette-paris.fr/',
    imageUrl: 'https://source.unsplash.com/800x600/?cafe,paris',
    rating: 4.3
  },
  {
    id: '5',
    name: 'The Circus Hostel',
    city: 'Berlin',
    type: 'ACCOMMODATION',
    description: 'Modern hostel with private rooms and dormitories',
    address: 'Weinbergsweg 1a, 10119 Berlin, Germany',
    website: 'https://www.circus-berlin.de/',
    imageUrl: 'https://source.unsplash.com/800x600/?hostel,berlin',
    rating: 4.4
  }
];

interface Place {
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

const PlacesPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  useEffect(() => {
    // In a real app, fetch from API
    // const fetchPlaces = async () => {
    //   try {
    //     const response = await fetch('API_URL/places');
    //     const data = await response.json();
    //     setPlaces(data);
    //     setFilteredPlaces(data);
    //   } catch (err) {
    //     setError('Failed to load places data');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchPlaces();

    // Using mock data for now
    setTimeout(() => {
      setPlaces(mockPlaces);
      setFilteredPlaces(mockPlaces);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Filter places based on search term, city, and type
    let result = places;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(place => 
        place.name.toLowerCase().includes(term) || 
        (place.description && place.description.toLowerCase().includes(term))
      );
    }
    
    if (cityFilter) {
      result = result.filter(place => place.city === cityFilter);
    }
    
    if (typeFilter) {
      result = result.filter(place => place.type === typeFilter);
    }
    
    setFilteredPlaces(result);
  }, [searchTerm, cityFilter, typeFilter, places]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCityFilterChange = (event: SelectChangeEvent) => {
    setCityFilter(event.target.value);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ATTRACTION':
        return <LocalActivityIcon />;
      case 'RESTAURANT':
        return <RestaurantIcon />;
      case 'ACCOMMODATION':
        return <HotelIcon />;
      case 'TRANSPORT':
        return <DirectionsBusIcon />;
      default:
        return <MoreHorizIcon />;
    }
  };

  // Get unique cities for filter
  const cities = Array.from(new Set(places.map(place => place.city)));
  
  // Get unique types for filter
  const types = Array.from(new Set(places.map(place => place.type)));

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
        Places to Visit
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Places"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="city-filter-label">Filter by City</InputLabel>
              <Select
                labelId="city-filter-label"
                id="city-filter"
                value={cityFilter}
                label="Filter by City"
                onChange={handleCityFilterChange}
              >
                <MenuItem value="">
                  <em>All Cities</em>
                </MenuItem>
                {cities.map(city => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="type-filter-label">Filter by Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                value={typeFilter}
                label="Filter by Type"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                {types.map(type => (
                  <MenuItem key={type} value={type}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getTypeIcon(type)}
                      <Box sx={{ ml: 1 }}>{type.charAt(0) + type.slice(1).toLowerCase()}</Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filteredPlaces.length === 0 ? (
        <Alert severity="info">
          No places found matching your criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredPlaces.map((place) => (
            <Grid item xs={12} sm={6} md={4} key={place.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3
                  }
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={place.imageUrl || `https://source.unsplash.com/800x600/?${place.name.replace(' ', ',')}`}
                    alt={place.name}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {place.name}
                      </Typography>
                      <Chip 
                        icon={getTypeIcon(place.type)} 
                        label={place.type.charAt(0) + place.type.slice(1).toLowerCase()} 
                        size="small" 
                        color={place.type === 'ATTRACTION' ? 'primary' : 'default'}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PlaceIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {place.city}
                      </Typography>
                    </Box>
                    
                    {place.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Rating: {place.rating}/5
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {place.description}
                    </Typography>
                    
                    {place.openingHours && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Hours:</strong> {place.openingHours}
                      </Typography>
                    )}
                    
                    {place.address && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Address:</strong> {place.address}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PlacesPage;
