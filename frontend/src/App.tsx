import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Components
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import DayDetailPage from './pages/DayDetailPage';
import PlacesPage from './pages/PlacesPage';
import NotesPage from './pages/NotesPage';
import MapPage from './pages/MapPage';
import ResourcesPage from './pages/ResourcesPage';

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />
              <Route path="/itinerary/:date" element={<DayDetailPage />} />
              <Route path="/places" element={<PlacesPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
            </Routes>
          </Layout>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
