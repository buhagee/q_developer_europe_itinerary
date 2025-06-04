import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Mock data - replace with API call
const mockLocations: Location[] = [
  { city: 'Malta', coordinates: [35.9375, 14.3754] as [number, number], dates: '18/06/25 - 20/06/25' },
  { city: 'London', coordinates: [51.5074, -0.1278] as [number, number], dates: '21/06/25 - 23/06/25' },
  { city: 'Paris', coordinates: [48.8566, 2.3522] as [number, number], dates: '24/06/25 - 26/06/25' },
  { city: 'Defqon', coordinates: [52.3676, 5.2179] as [number, number], dates: '27/06/25 - 29/06/25' }, // Biddinghuizen, NL
  { city: 'Berlin', coordinates: [52.5200, 13.4050] as [number, number], dates: '30/06/25 - 02/07/25' },
  { city: 'Prague', coordinates: [50.0755, 14.4378] as [number, number], dates: '03/07/25 - 05/07/25' },
  { city: 'Ravello', coordinates: [40.6583, 14.6128] as [number, number], dates: '06/07/25 - 08/07/25' },
  { city: 'Rome', coordinates: [41.9028, 12.4964] as [number, number], dates: '09/07/25 - 11/07/25' },
  { city: 'Venice', coordinates: [45.4408, 12.3155] as [number, number], dates: '12/07/25 - 13/07/25' },
  { city: 'Lake Como', coordinates: [46.0154, 9.2852] as [number, number], dates: '14/07/25 - 15/07/25' },
  { city: 'Interlakken', coordinates: [46.6863, 7.8632] as [number, number], dates: '16/07/25 - 18/07/25' },
  { city: 'Lyon', coordinates: [45.7640, 4.8357] as [number, number], dates: '19/07/25 - 20/07/25' },
  { city: 'Nice', coordinates: [43.7102, 7.2620] as [number, number], dates: '21/07/25 - 23/07/25' },
  { city: 'Antwerp', coordinates: [51.2194, 4.4025] as [number, number], dates: '24/07/25 - 27/07/25' },
  { city: 'Istanbul', coordinates: [41.0082, 28.9784] as [number, number], dates: '28/07/25 - 30/07/25' },
  { city: 'Cappadocia', coordinates: [38.6431, 34.8307] as [number, number], dates: '31/07/25 - 02/08/25' }
];

interface Location {
  city: string;
  coordinates: [number, number];
  dates: string;
}

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    // In a real app, fetch from API
    // const fetchLocations = async () => {
    //   try {
    //     const response = await fetch('API_URL/locations');
    //     const data = await response.json();
    //     setLocations(data);
    //   } catch (err) {
    //     setError('Failed to load location data');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchLocations();

    // Using mock data for now
    setTimeout(() => {
      setLocations(mockLocations);
      setLoading(false);
    }, 500);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

  // Create polylines for the journey
  const polylinePositions = locations.map(loc => loc.coordinates);

  // Calculate map bounds
  const bounds = L.latLngBounds(locations.map(loc => L.latLng(loc.coordinates[0], loc.coordinates[1])));

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Travel Map
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Full Journey" />
          <Tab label="By Country" />
          <Tab label="By Month" />
        </Tabs>
      </Paper>

      <Paper sx={{ height: '600px', width: '100%', overflow: 'hidden' }}>
        <MapContainer 
          bounds={bounds} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {locations.map((location, index) => (
            <Marker 
              key={location.city} 
              position={location.coordinates}
            >
              <Popup>
                <Typography variant="subtitle1">{location.city}</Typography>
                <Typography variant="body2">Dates: {location.dates}</Typography>
              </Popup>
            </Marker>
          ))}
          
          <Polyline 
            positions={polylinePositions} 
            color="blue" 
            weight={3} 
            opacity={0.7} 
            dashArray="5, 10"
          />
        </MapContainer>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Journey Overview
        </Typography>
        <Typography variant="body1">
          Your European adventure spans 16 destinations across 47 days, covering approximately 
          10,000 kilometers through 10 countries.
        </Typography>
      </Box>
    </Box>
  );
};

export default MapPage;
