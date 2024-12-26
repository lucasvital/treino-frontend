import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  CardActionArea,
  Grid,
  Button,
  Chip
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import WorkoutDisplay from '../components/WorkoutDisplay';
import { Workout } from '../types/api';
import { Exercise } from '../types/api';

export const HomePage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`https://${import.meta.env.VITE_API_URL}/api/workouts`);
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  const handleWorkoutUpdate = async (workoutId: string, updatedWorkouts: { [key: string]: Exercise[] }) => {
    try {
      const response = await fetch(`https://${import.meta.env.VITE_API_URL}/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ treinos: updatedWorkouts }),
      });

      if (response.ok) {
        fetchWorkouts();
      }
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleBack = () => {
    setSelectedWorkout(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Meus Treinos
        </Typography>

        {selectedWorkout ? (
          <Box>
            <Button onClick={handleBack} sx={{ mb: 2 }}>
              Voltar para a lista
            </Button>
            <Typography variant="h5" gutterBottom>
              {selectedWorkout.workoutName}
            </Typography>
            <WorkoutDisplay 
              workouts={selectedWorkout.treinos} 
              onUpdate={(updatedWorkouts) => handleWorkoutUpdate(selectedWorkout._id, updatedWorkouts)}
              editable
            />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {workouts.map((workout) => (
              <Grid item xs={12} sm={6} md={4} key={workout._id}>
                <Card>
                  <CardActionArea onClick={() => handleWorkoutClick(workout)}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {workout.workoutName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        <Chip
                          icon={<FitnessCenterIcon />}
                          label="Treino"
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          icon={<TimerIcon />}
                          label={new Date(workout.createdAt).toLocaleDateString()}
                          color="secondary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
