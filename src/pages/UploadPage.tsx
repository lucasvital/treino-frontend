import React, { useState } from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import FileUpload from '../components/FileUpload';
import WorkoutDisplay from '../components/WorkoutDisplay';
import { WorkoutResponse } from '../types/api';

export const UploadPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutResponse['workout'] | null>(null);
  const [workoutName, setWorkoutName] = useState('');

  const handleFileProcessed = (data: WorkoutResponse) => {
    console.log('Workouts recebidos:', data.workout);
    setWorkouts(data.workout);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          Upload de Treino
        </Typography>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider'
          }}
        >
          <FileUpload 
            onFileProcessed={handleFileProcessed}
            workoutName={workoutName}
            onWorkoutNameChange={setWorkoutName}
          />

          {workouts && (
            <Box sx={{ mt: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  mb: 2,
                  fontWeight: 'medium'
                }}
              >
                Preview do Treino
              </Typography>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <WorkoutDisplay workout={workouts} />
              </Paper>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default UploadPage;
