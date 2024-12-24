import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  useTheme,
  Skeleton,
  Chip,
  Stack,
  Fab,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Exercise {
  exercicio: string;
  series: string;
  carga: string;
  intervalo: string;
}

interface Workout {
  _id: string;
  workoutName: string;
  treinos: {
    [key: string]: Exercise[];
  };
  createdAt: string;
}

const WorkoutList: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/workouts');
      if (!response.ok) {
        throw new Error('Erro ao carregar treinos');
      }
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutClick = (id: string) => {
    navigate(`/workout/${id}`);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM", { locale: ptBR });
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Meus Treinos</Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4,
          textAlign: { xs: 'center', sm: 'left' },
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        Meus Treinos
      </Typography>

      <Grid container spacing={2}>
        {workouts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((workout) => (
            <Grid item xs={12} sm={6} md={4} key={workout._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <CardActionArea 
                  onClick={() => handleWorkoutClick(workout._id)}
                  sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2
                  }}
                >
                  <Typography 
                    variant="h6" 
                    component="div" 
                    gutterBottom
                    sx={{ 
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      width: '100%'
                    }}
                  >
                    {workout.workoutName}
                  </Typography>
                  
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                  >
                    Criado em {formatDate(workout.createdAt)}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {['A', 'B', 'C', 'D']
                      .filter(key => workout.treinos[key])
                      .map(key => (
                        <Chip
                          key={key}
                          icon={<FitnessCenterIcon />}
                          label={`Treino ${key}`}
                          color="primary"
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                        />
                      ))}
                  </Stack>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={() => navigate('/upload')}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default WorkoutList;
