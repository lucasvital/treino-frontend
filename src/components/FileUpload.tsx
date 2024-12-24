import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Typography, 
  Button,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { WorkoutResponse } from '../types/api';

interface FileUploadProps {
  onFileProcessed: (data: WorkoutResponse) => void;
  workoutName: string;
  onWorkoutNameChange: (name: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, workoutName, onWorkoutNameChange }) => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    // Extrai o nome do arquivo sem a extensão para usar como nome do treino
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    onWorkoutNameChange(fileName);

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workoutName', workoutName || fileName);

    try {
      const response = await fetch('http://localhost:3000/api/workouts/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer upload do arquivo');
      }

      onFileProcessed(data);
      setSnackbar({
        open: true,
        message: 'Arquivo processado com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Erro ao processar arquivo',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [onFileProcessed, workoutName, onWorkoutNameChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
    multiple: false
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        label="Nome do Treino"
        value={workoutName}
        onChange={(e) => onWorkoutNameChange(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Paper
        elevation={0}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <Box
          {...getRootProps()}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <input {...getInputProps()} />
          
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <CloudUploadIcon 
                sx={{ 
                  fontSize: 64, 
                  color: isDragActive ? 'primary.main' : 'text.secondary',
                  mb: 2
                }} 
              />
              <Typography variant="h6" align="center" gutterBottom>
                {isDragActive
                  ? 'Solte o arquivo aqui...'
                  : 'Arraste e solte seu arquivo aqui'}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                ou
              </Typography>
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  mt: 1,
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 4
                }}
              >
                Selecionar Arquivo
              </Button>
              <Typography variant="caption" color="text.secondary" align="center">
                Arquivos suportados: .txt, .csv
              </Typography>
            </>
          )}
        </Box>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUpload;
