import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardContent,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TranslateIcon from '@mui/icons-material/Translate';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EuroIcon from '@mui/icons-material/Euro';
import WifiIcon from '@mui/icons-material/Wifi';
import PublicIcon from '@mui/icons-material/Public';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NightlifeIcon from '@mui/icons-material/Nightlife';

const ResourcesPage: React.FC = () => {
  const emergencyContacts = [
    { country: 'All EU Countries', emergency: '112', police: '112', ambulance: '112' },
    { country: 'UK', emergency: '999', police: '999', ambulance: '999' },
    { country: 'Turkey', emergency: '112', police: '155', ambulance: '112' },
    { country: 'Switzerland', emergency: '112', police: '117', ambulance: '144' },
  ];

  const usefulPhrases = [
    { 
      language: 'French', 
      phrases: [
        { phrase: 'Hello', translation: 'Bonjour' },
        { phrase: 'Thank you', translation: 'Merci' },
        { phrase: 'Excuse me', translation: 'Excusez-moi' },
        { phrase: 'Do you speak English?', translation: 'Parlez-vous anglais?' },
        { phrase: 'Where is the bathroom?', translation: 'Où sont les toilettes?' },
      ]
    },
    { 
      language: 'German', 
      phrases: [
        { phrase: 'Hello', translation: 'Hallo' },
        { phrase: 'Thank you', translation: 'Danke' },
        { phrase: 'Excuse me', translation: 'Entschuldigung' },
        { phrase: 'Do you speak English?', translation: 'Sprechen Sie Englisch?' },
        { phrase: 'Where is the bathroom?', translation: 'Wo ist die Toilette?' },
      ]
    },
    { 
      language: 'Italian', 
      phrases: [
        { phrase: 'Hello', translation: 'Ciao' },
        { phrase: 'Thank you', translation: 'Grazie' },
        { phrase: 'Excuse me', translation: 'Scusi' },
        { phrase: 'Do you speak English?', translation: 'Parla inglese?' },
        { phrase: 'Where is the bathroom?', translation: 'Dov\'è il bagno?' },
      ]
    },
    { 
      language: 'Turkish', 
      phrases: [
        { phrase: 'Hello', translation: 'Merhaba' },
        { phrase: 'Thank you', translation: 'Teşekkür ederim' },
        { phrase: 'Excuse me', translation: 'Afedersiniz' },
        { phrase: 'Do you speak English?', translation: 'İngilizce biliyor musunuz?' },
        { phrase: 'Where is the bathroom?', translation: 'Tuvalet nerede?' },
      ]
    },
  ];

  const travelTips = [
    { 
      category: 'Transportation', 
      icon: <DirectionsBusIcon />,
      tips: [
        'Consider purchasing Eurail Pass for multiple train journeys',
        'Book high-speed trains in advance for better prices',
        'Use local transportation apps like Citymapper in major cities',
        'In London, get an Oyster card for public transport',
        'For Paris, consider a carnet of 10 metro tickets for savings'
      ]
    },
    { 
      category: 'Food & Drink', 
      icon: <RestaurantIcon />,
      tips: [
        'Lunch menus are often cheaper than dinner in many European countries',
        'Tap water is safe to drink in most Western European countries',
        'Ask for "tap water" in restaurants to avoid paying for bottled water',
        'Try local specialties in each region',
        'Markets are great for affordable fresh food'
      ]
    },
    { 
      category: 'Nightlife & Entertainment', 
      icon: <NightlifeIcon />,
      tips: [
        'Many museums have free or discounted days - check in advance',
        'Student discounts are widely available with international student ID',
        'Book popular attractions online to skip lines',
        'Check for city passes that include multiple attractions',
        'Look for free walking tours in major cities'
      ]
    },
  ];

  const usefulApps = [
    { name: 'Google Maps', description: 'Navigation and offline maps' },
    { name: 'Google Translate', description: 'Translation with camera feature' },
    { name: 'XE Currency', description: 'Currency conversion' },
    { name: 'Citymapper', description: 'Public transport navigation in major cities' },
    { name: 'TripAdvisor', description: 'Reviews for attractions and restaurants' },
    { name: 'Airbnb', description: 'Access to your accommodation bookings' },
    { name: 'Trainline', description: 'Train tickets across Europe' },
    { name: 'Uber', description: 'Ride-hailing in many European cities' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Travel Resources
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* Emergency Contacts */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalHospitalIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h5">Emergency Contacts</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Country</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Emergency</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Police</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Ambulance</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencyContacts.map((contact, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '8px' }}>{contact.country}</td>
                      <td style={{ padding: '8px' }}>{contact.emergency}</td>
                      <td style={{ padding: '8px' }}>{contact.police}</td>
                      <td style={{ padding: '8px' }}>{contact.ambulance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>

          {/* Travel Tips */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PublicIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">Travel Tips</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {travelTips.map((category, index) => (
              <Accordion key={index} defaultExpanded={index === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {category.icon}
                    <Typography sx={{ ml: 1 }}>{category.category}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {category.tips.map((tip, tipIndex) => (
                      <ListItem key={tipIndex}>
                        <ListItemText primary={tip} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Language Phrases */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TranslateIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">Useful Phrases</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {usefulPhrases.map((language, index) => (
              <Accordion key={index} defaultExpanded={index === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{language.language}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                          <th style={{ textAlign: 'left', padding: '8px' }}>English</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>{language.language}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {language.phrases.map((phrase, phraseIndex) => (
                          <tr key={phraseIndex} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '8px' }}>{phrase.phrase}</td>
                            <td style={{ padding: '8px' }}>{phrase.translation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          {/* Useful Apps */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WifiIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">Useful Apps</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {usefulApps.map((app, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{app.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {app.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Additional Resources */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Additional Resources
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <EuroIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Currency Exchange" 
                  secondary="Use ATMs for the best exchange rates. Notify your bank before traveling to avoid card blocks."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocalPhoneIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Mobile Data" 
                  secondary="Consider purchasing a European SIM card or check with your provider about international data plans."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Travel Insurance" 
                  secondary={
                    <span>
                      Make sure your travel insurance covers all countries. 
                      <Link href="https://www.worldnomads.com" target="_blank" sx={{ ml: 1 }}>
                        World Nomads
                      </Link> offers good coverage for multiple countries.
                    </span>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourcesPage;
