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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlaceIcon from '@mui/icons-material/Place';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { format, parse } from 'date-fns';
import { getItineraryByDate, updateItinerary, ItineraryItem } from '../api/itinerary';
import { getNotes, createNote, Note } from '../api/notes';

interface EditDialogState {
  open: boolean;
  field: string;
  value: string;
}

const DayDetailPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [dayData, setDayData] = useState<ItineraryItem | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    field: '',
    value: ''
  });

  useEffect(() => {
    if (!date) {
      setError('Invalid date parameter');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const dayData = await getItineraryByDate(date);
        setDayData(dayData);
        
        try {
          const notesData = await getNotes(date);
          setNotes(notesData || []);
        } catch (notesErr) {
          console.error('Failed to load notes:', notesErr);
          // Don't set error for notes, just show empty notes section
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to load day data:', err);
        setError('Failed to load day data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [date]);

  const formatDate = (dateString: string) => {
    try {
      const parsedDate = parse(dateString, 'dd/MM/yy', new Date());
      return format(parsedDate, 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !date) return;
    
    try {
      const createdNote = await createNote(date, newNote);
      setNotes([...notes, createdNote]);
      setNewNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleEditClick = (field: string, value: string = '') => {
    setEditDialog({
      open: true,
      field,
      value: value || ''
    });
  };

  const handleCloseDialog = () => {
    setEditDialog({
      ...editDialog,
      open: false
    });
  };

  const handleSaveEdit = async () => {
    if (!date || !dayData) return;
    
    try {
      const updateData = {
        ...dayData,
        [editDialog.field]: editDialog.value
      };
      
      const updatedData = await updateItinerary(date, updateData);
      setDayData(updatedData);
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to update itinerary:', err);
    }
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

            {/* Activities Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Activities</Typography>
                </Box>
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleEditClick('activities', dayData.activities)}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              {dayData.activities ? (
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {dayData.activities}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  No activities planned. Click edit to add activities.
                </Typography>
              )}
            </Box>

            {/* Accommodation Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HotelIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Accommodation</Typography>
                </Box>
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleEditClick('accommodation', dayData.accommodation)}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              {dayData.accommodation ? (
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {dayData.accommodation}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  No accommodation details. Click edit to add accommodation.
                </Typography>
              )}
            </Box>

            {/* Travel Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FlightIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Travel</Typography>
                </Box>
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleEditClick('travel', dayData.travel)}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              {dayData.travel ? (
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {dayData.travel}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  No travel details. Click edit to add travel information.
                </Typography>
              )}
            </Box>

            {/* Food Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RestaurantIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Food</Typography>
                </Box>
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => handleEditClick('food', dayData.food)}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              {dayData.food ? (
                <Typography variant="body1" sx={{ ml: 4 }}>
                  {dayData.food}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  No food details. Click edit to add restaurants or food plans.
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Location Image */}
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="300"
              image={`https://source.unsplash.com/800x600/?${encodeURIComponent(dayData.location)},travel`}
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
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>Edit {editDialog.field}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the {editDialog.field} information for this day.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="edit-field"
            label={editDialog.field.charAt(0).toUpperCase() + editDialog.field.slice(1)}
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editDialog.value}
            onChange={(e) => setEditDialog({...editDialog, value: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DayDetailPage;
