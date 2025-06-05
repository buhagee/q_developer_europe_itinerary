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
  SelectChangeEvent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { getPlaces, createPlace, Place } from '../api/places';

interface NewPlaceForm {
  name: string;
  city: string;
  type: string;
  description: string;
  address: string;
  openingHours: string;
  website: string;
  imageUrl: string;
  rating: number | null;
}

const PlacesPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newPlace, setNewPlace] = useState<NewPlaceForm>({
    name: '',
    city: '',
    type: 'ATTRACTION',
    description: '',
    address: '',
    openingHours: '',
    website: '',
    imageUrl: '',
    rating: null
  });

  const apiUrl = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchPlacesData = async () => {
      try {
        setLoading(true);
        const data = await getPlaces();
        setPlaces(data);
        setFilteredPlaces(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load places data:', err);
        setError('Failed to load places data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlacesData();
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

  const handleAddPlace = async () => {
    try {
      const placeData = {
        name: newPlace.name,
        city: newPlace.city,
        type: newPlace.type,
        description: newPlace.description,
        address: newPlace.address,
        openingHours: newPlace.openingHours,
        website: newPlace.website,
        imageUrl: newPlace.imageUrl,
        rating: newPlace.rating || undefined
      };
      
      const response = await createPlace(placeData);
      setPlaces([...places, response]);
      setOpenAddDialog(false);
      resetNewPlaceForm();
    } catch (err) {
      console.error('Failed to add place:', err);
    }
  };

  const resetNewPlaceForm = () => {
    setNewPlace({
      name: '',
      city: '',
      type: 'ATTRACTION',
      description: '',
      address: '',
      openingHours: '',
      website: '',
      imageUrl: '',
      rating: null
    });
  };

  const handleNewPlaceChange = (field: keyof NewPlaceForm, value: any) => {
    setNewPlace({
      ...newPlace,
      [field]: value
    });
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Places to Visit
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Place
        </Button>
      </Box>

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
          No places found matching your criteria. Try adjusting your filters or add new places.
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
                    image={place.imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(place.city)},${encodeURIComponent(place.name)}`}
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
                        <Rating value={place.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {place.rating.toFixed(1)}
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

      {/* Add Place Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Place</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Fill in the details to add a new place to your itinerary.
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={newPlace.name}
                onChange={(e) => handleNewPlaceChange('name', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                value={newPlace.city}
                onChange={(e) => handleNewPlaceChange('city', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={newPlace.type}
                  label="Type"
                  onChange={(e) => handleNewPlaceChange('type', e.target.value)}
                >
                  <MenuItem value="ATTRACTION">Attraction</MenuItem>
                  <MenuItem value="RESTAURANT">Restaurant</MenuItem>
                  <MenuItem value="ACCOMMODATION">Accommodation</MenuItem>
                  <MenuItem value="TRANSPORT">Transport</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mt: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  value={newPlace.rating}
                  onChange={(_, newValue) => handleNewPlaceChange('rating', newValue)}
                  precision={0.5}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newPlace.description}
                onChange={(e) => handleNewPlaceChange('description', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={newPlace.address}
                onChange={(e) => handleNewPlaceChange('address', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Opening Hours"
                value={newPlace.openingHours}
                onChange={(e) => handleNewPlaceChange('openingHours', e.target.value)}
                margin="normal"
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={newPlace.website}
                onChange={(e) => handleNewPlaceChange('website', e.target.value)}
                margin="normal"
                placeholder="https://..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL (optional)"
                value={newPlace.imageUrl}
                onChange={(e) => handleNewPlaceChange('imageUrl', e.target.value)}
                margin="normal"
                placeholder="Leave blank to use an auto-generated image"
                helperText="If left blank, an image will be automatically generated based on the place name and city"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddPlace} 
            variant="contained"
            disabled={!newPlace.name || !newPlace.city || !newPlace.type}
          >
            Add Place
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlacesPage;
