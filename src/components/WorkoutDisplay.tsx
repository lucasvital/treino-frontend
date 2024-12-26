import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Workout, Exercise } from '../types/api';

interface WorkoutDisplayProps {
  workouts?: { [key: string]: Exercise[] };
  workout?: Workout;
  onUpdate?: (updatedWorkouts: { [key: string]: Exercise[] }) => void;
  editable?: boolean;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workouts, workout, onUpdate, editable = false }) => {
  const [editingExercise, setEditingExercise] = useState<{ group: string; index: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const displayWorkouts = workouts || (workout ? workout.treinos : {});

  const handleEditClick = (group: string, index: number, currentValue: string) => {
    setEditingExercise({ group, index });
    setEditValue(currentValue);
  };

  const handleSave = async (group: string, index: number) => {
    if (!onUpdate) return;

    const updatedWorkouts = { ...displayWorkouts };
    updatedWorkouts[group][index].carga = editValue;
    onUpdate(updatedWorkouts);
    setEditingExercise(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {Object.entries(displayWorkouts)
        .sort(([a], [b]) => {
          const order = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
          return (order[a as keyof typeof order] || 0) - (order[b as keyof typeof order] || 0);
        })
        .map(([group, exercises]) => (
        <Paper key={group} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {group}
          </Typography>
          <Grid container spacing={2}>
            {exercises.map((exercise: Exercise, index: number) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ flex: 1 }}>
                    {exercise.exercicio}
                  </Typography>
                  <Typography sx={{ flex: 1 }}>
                    {exercise.series}
                  </Typography>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {editingExercise?.group === group && editingExercise?.index === index ? (
                      <>
                        <TextField
                          size="small"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleSave(group, index)}
                          color="primary"
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setEditingExercise(null)}
                          color="error"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <Typography>{exercise.carga}</Typography>
                        {editable && (
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(group, index, exercise.carga)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>
                  <Typography sx={{ flex: 1 }}>
                    {exercise.intervalo}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default WorkoutDisplay;
