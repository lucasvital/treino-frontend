import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, IconButton, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { lightTheme, darkTheme } from './theme/theme';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar 
            position="sticky" 
            elevation={0}
            sx={{ 
              background: darkMode 
                ? 'rgba(17, 25, 40, 0.8)' 
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography 
                variant="h6" 
                component={Link} 
                to="/" 
                sx={{ 
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }}
              >
                Treinos
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button 
                  component={Link} 
                  to="/upload"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                  }}
                >
                  Upload
                </Button>
                <IconButton 
                  onClick={() => setDarkMode(!darkMode)} 
                  sx={{ 
                    ml: 1,
                    color: darkMode ? 'primary.light' : 'primary.main'
                  }}
                >
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ 
            flexGrow: 1, 
            bgcolor: 'background.default',
            minHeight: '100vh'
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
