import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  IconButton,
  Tooltip,
  AppBar,
  Toolbar,
  CircularProgress,
  useMediaQuery,
  alpha,
} from '@mui/material';

// Icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import GitHubIcon from '@mui/icons-material/GitHub';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

// Components
import { UploadZone } from './components/UploadZone';
import { MetadataViewer } from './components/MetadataViewer';
import { parseImageMetadata, type ExifData } from './utils/exifParser';

import './App.css';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  // Initialize theme mode from media query or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else {
      setThemeMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode]);

  const handleThemeToggle = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // Custom theme creation
  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === 'dark' ? '#818cf8' : '#4f46e5', // indigo
      },
      secondary: {
        main: themeMode === 'dark' ? '#f472b6' : '#db2777', // pink
      },
      background: {
        default: themeMode === 'dark' ? '#0b0f19' : '#f8fafc',
        paper: themeMode === 'dark' ? '#111827' : '#ffffff',
      },
      divider: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h4: {
        fontWeight: 800,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontFamily: "'Outfit', sans-serif",
      },
    },
    shape: {
      borderRadius: 12,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setIsLoading(true);
    setError(null);
    setFile(selectedFile);

    // Create an object URL for preview
    const url = URL.createObjectURL(selectedFile);
    setImageUrl(url);

    try {
      const data = await parseImageMetadata(selectedFile);
      setExifData(data);
    } catch (err: any) {
      console.error('Error parsing EXIF:', err);
      setError('Failed to extract metadata from the image. It might not contain EXIF data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setFile(null);
    setImageUrl('');
    setExifData(null);
    setError(null);
  };

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: themeMode === 'dark'
            ? 'radial-gradient(ellipse at top, #0f172a, #0b0f19)'
            : 'radial-gradient(ellipse at top, #e0e7ff, #f8fafc)',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Header App Bar */}
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: themeMode === 'dark' ? 'rgba(11, 15, 25, 0.5)' : 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: '#ffffff',
                    width: 38,
                    height: 38,
                    borderRadius: 2.5,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  <PhotoCameraBackIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Outfit',
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(
                      theme.palette.text.primary,
                      0.7
                    )} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Meta Reader
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                  <IconButton onClick={handleThemeToggle} color="inherit">
                    {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="View Project on GitHub">
                  <IconButton
                    color="inherit"
                    href="https://github.com/AimerNeige/meta-reader-website"
                    target="_blank"
                  >
                    <GitHubIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main Content Area */}
        <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
          {!file ? (
            // Home / Upload Screen
            <Box className="fade-in" sx={{ maxWidth: 640, mx: 'auto', textAlign: 'center', mt: { xs: 2, md: 4 } }}>
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: themeMode === 'dark'
                      ? 'rgba(129, 140, 248, 0.1)'
                      : 'rgba(79, 70, 229, 0.05)',
                    color: 'primary.main',
                    px: 2,
                    py: 0.5,
                    borderRadius: 10,
                    mb: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  }}
                >
                  <SettingsSuggestIcon sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                    100% PRIVATE & CLIENT-SIDE
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: 'Outfit',
                    fontWeight: 800,
                    letterSpacing: '-1.5px',
                    mb: 1.5,
                    lineHeight: 1.15,
                  }}
                >
                  Read your photo's{' '}
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    EXIF metadata
                  </span>{' '}
                  instantly.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxW: 480, mx: 'auto' }}>
                  Visualize lens specs, camera settings, coordinates, and raw tags with zero uploads.
                  Your privacy is fully protected.
                </Typography>
              </Box>

              <UploadZone onFileSelect={handleFileSelect} error={error} />
            </Box>
          ) : isLoading ? (
            // Loading State
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 12,
                gap: 2,
              }}
            >
              <CircularProgress size={48} thickness={4.5} />
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Extracting EXIF metadata...
              </Typography>
            </Box>
          ) : exifData ? (
            // Dashboard Viewer
            <MetadataViewer data={exifData} imageUrl={imageUrl} onClear={handleClear} />
          ) : (
            // Backup Error State
            <Box sx={{ maxWidth: 480, mx: 'auto', textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                An unexpected error occurred.
              </Typography>
              <Tooltip title="Reset uploader">
                <IconButton onClick={handleClear} color="primary">
                  Go Back
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
            background: themeMode === 'dark' ? 'rgba(11, 15, 25, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Meta Reader • Built with React & Material-UI • Powered by exifr
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              All parsing is performed in your browser. No image data is ever transmitted to a server.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
