import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Button,
  Tooltip,
  useTheme,
  Divider,
} from '@mui/material';

// Icons
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CameraIcon from '@mui/icons-material/Camera';
import MapIcon from '@mui/icons-material/Map';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExploreIcon from '@mui/icons-material/Explore';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import InfoIcon from '@mui/icons-material/Info';

import type { ExifData } from '../utils/exifParser';

interface MetadataViewerProps {
  data: ExifData;
  imageUrl: string;
  onClear: () => void;
}

export const MetadataViewer: React.FC<MetadataViewerProps> = ({ data, imageUrl, onClear }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const isDark = theme.palette.mode === 'dark';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedTag(key);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  // Convert raw EXIF tags into a flat readable list of key-value pairs
  const tagList = useMemo(() => {
    const list: { key: string; value: string; category: string }[] = [];

    // Helper to format values nicely
    const formatVal = (val: any): string => {
      if (val === null || val === undefined) return '';
      if (val instanceof Date) return val.toLocaleString();
      if (typeof val === 'object') {
        try {
          return JSON.stringify(val);
        } catch {
          return String(val);
        }
      }
      return String(val);
    };

    // Extract EXIF tags
    Object.entries(data.rawTags).forEach(([key, val]) => {
      if (key === 'rawTags' || key === 'latitude' || key === 'longitude' || key === 'altitude') return;
      
      let category = 'Raw EXIF';
      const keyLower = key.toLowerCase();

      if (
        keyLower.includes('gps') ||
        keyLower.includes('latitude') ||
        keyLower.includes('longitude') ||
        keyLower.includes('altitude')
      ) {
        category = 'GPS';
      } else if (
        keyLower.includes('exposure') ||
        keyLower.includes('aperture') ||
        keyLower.includes('shutter') ||
        keyLower.includes('iso') ||
        keyLower.includes('fnumber') ||
        keyLower.includes('focallength') ||
        keyLower.includes('metering') ||
        keyLower.includes('flash') ||
        keyLower.includes('whitebalance')
      ) {
        category = 'Camera settings';
      } else if (
        keyLower.includes('make') ||
        keyLower.includes('model') ||
        keyLower.includes('lens') ||
        keyLower.includes('software') ||
        keyLower.includes('creator') ||
        keyLower.includes('profile')
      ) {
        category = 'Hardware & Software';
      } else if (
        keyLower.includes('date') ||
        keyLower.includes('time') ||
        keyLower.includes('modify') ||
        keyLower.includes('original')
      ) {
        category = 'Time & Date';
      }

      list.push({
        key,
        value: formatVal(val),
        category,
      });
    });

    return list.sort((a, b) => a.key.localeCompare(b.key));
  }, [data]);

  // Filtered tags based on active category tab and search query
  const filteredTags = useMemo(() => {
    return tagList.filter((tag) => {
      const matchesSearch =
        tag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.value.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 0) return true; // All
      if (activeTab === 1) return tag.category === 'Camera settings' || tag.category === 'Hardware & Software'; // Exposure & Hardware
      if (activeTab === 2) return tag.category === 'GPS'; // GPS
      return tag.category === 'Raw EXIF' || tag.category === 'Time & Date' || tag.category === 'Other'; // Others
    });
  }, [tagList, activeTab, searchQuery]);

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>
          Visual Analysis
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClear}
          startIcon={<FileOpenIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderWidth: '1.5px',
            '&:hover': { borderWidth: '1.5px' },
          }}
        >
          Open Another Photo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Image Preview + GPS */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Image Preview Card */}
            <Card
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: isDark ? 'rgba(30, 41, 59, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                boxShadow: isDark
                  ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
                  : '0 10px 30px -10px rgba(99, 102, 241, 0.1)',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 320,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0f172a',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imageUrl}
                  alt="Metadata Source"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" noWrap sx={{ mb: 1, fontFamily: 'Outfit', fontWeight: 600 }}>
                  {data.fileName}
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InsertDriveFileIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Size
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {data.fileSize}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AspectRatioIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Resolution
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {data.imageWidth && data.imageHeight
                            ? `${data.imageWidth} × ${data.imageHeight}`
                            : 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* GPS Map Card */}
            {data.latitude !== undefined && data.longitude !== undefined && (
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: isDark ? 'rgba(30, 41, 59, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                  boxShadow: isDark
                    ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
                    : '0 10px 30px -10px rgba(99, 102, 241, 0.1)',
                }}
              >
                <CardContent sx={{ p: 3, pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <MapIcon color="primary" />
                    <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 600 }}>
                      GPS Location
                    </Typography>
                  </Box>

                  {/* OpenStreetMap Iframe Embed */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      borderRadius: 2,
                      overflow: 'hidden',
                      mb: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <iframe
                      title="GPS Location Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                        data.longitude - 0.005
                      }%2C${data.latitude - 0.003}%2C${data.longitude + 0.005}%2C${
                        data.latitude + 0.003
                      }&layer=mapnik&marker=${data.latitude}%2C${data.longitude}`}
                    />
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">
                        Latitude
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', fontWeight: 500 }}>
                        {data.latitude.toFixed(6)}°
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary">
                        Longitude
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', fontWeight: 500 }}>
                        {data.longitude.toFixed(6)}°
                      </Typography>
                    </Grid>
                    {data.altitude !== undefined && (
                      <Grid size={12}>
                        <Typography variant="caption" color="text.secondary">
                          Altitude
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {typeof data.altitude === 'number'
                            ? `${data.altitude.toFixed(1)}m (asl)`
                            : String(data.altitude)}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<ExploreIcon />}
                      href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                      target="_blank"
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                      Google Maps
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<MapIcon />}
                      href={`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}#map=16/${data.latitude}/${data.longitude}`}
                      target="_blank"
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                      OSM
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>

        {/* Right Column: Spec display & tags table */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Specs Highlight Card */}
            <Card
              sx={{
                borderRadius: 4,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(243, 244, 246, 0.8) 100%)',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                boxShadow: isDark
                  ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
                  : '0 10px 30px -10px rgba(99, 102, 241, 0.1)',
                p: 3,
              }}
            >
              {/* Hardware Title */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <CameraAltIcon color="primary" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 700, lineHeight: 1.2 }}>
                    {data.model || 'Unknown Camera'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.make ? `${data.make}` : 'Unknown Brand'}{' '}
                    {data.software ? `• Software: ${data.software}` : ''}
                  </Typography>
                </Box>
              </Box>

              {/* Lens info if available */}
              {data.lensModel && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    background: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.5)',
                    border: '1px dashed',
                    borderColor: theme.palette.divider,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <CameraIcon color="secondary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Lens Model
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {data.lensModel}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Exposure Triangle Badges */}
              <Grid container spacing={2}>
                {/* Aperture */}
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: isDark ? 'rgba(15, 23, 42, 0.3)' : '#ffffff',
                      boxShadow: isDark ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.03)',
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      APERTURE
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{ my: 0.5, fontFamily: 'Outfit', fontWeight: 700 }}
                    >
                      {data.fNumber ? `ƒ/${data.fNumber}` : '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Depth of field
                    </Typography>
                  </Box>
                </Grid>

                {/* Shutter Speed */}
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: isDark ? 'rgba(15, 23, 42, 0.3)' : '#ffffff',
                      boxShadow: isDark ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.03)',
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      SHUTTER
                    </Typography>
                    <Typography
                      variant="h5"
                      color="secondary"
                      sx={{ my: 0.5, fontFamily: 'Outfit', fontWeight: 700 }}
                    >
                      {data.exposureTimeStr || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {data.exposureTime ? `${data.exposureTime.toFixed(4)}s` : 'Motion blur'}
                    </Typography>
                  </Box>
                </Grid>

                {/* ISO */}
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: isDark ? 'rgba(15, 23, 42, 0.3)' : '#ffffff',
                      boxShadow: isDark ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.03)',
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      ISO SPEED
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ my: 0.5, color: '#f59e0b', fontFamily: 'Outfit', fontWeight: 700 }}
                    >
                      {data.iso || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Light sensitivity
                    </Typography>
                  </Box>
                </Grid>

                {/* Focal Length */}
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: isDark ? 'rgba(15, 23, 42, 0.3)' : '#ffffff',
                      boxShadow: isDark ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.03)',
                      border: `1px solid ${theme.palette.divider}`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      FOCAL LENGTH
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ my: 0.5, color: '#10b981', fontFamily: 'Outfit', fontWeight: 700 }}
                    >
                      {data.focalLength ? `${data.focalLength}mm` : '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {data.focalLength35mm ? `Eqv: ${data.focalLength35mm}mm` : 'Zoom scale'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Extra exposure settings */}
              <Divider sx={{ my: 2.5 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Exposure Program
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {data.exposureProgram || 'Standard / Auto'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Metering Mode
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {data.meteringMode || 'Average / Spot'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Flash
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {data.flash || 'Unknown'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    White Balance
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {data.whiteBalance || 'Auto'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Exposure Bias
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                    {data.exposureBias !== undefined
                      ? `${data.exposureBias > 0 ? '+' : ''}${data.exposureBias} EV`
                      : '0 EV'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="caption" color="text.secondary">
                    Capture Time
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16 }} color="action" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {data.dateTimeOriginalStr || 'Unknown'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Comprehensive Tag Table Card */}
            <Card
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: isDark ? 'rgba(30, 41, 59, 0.2)' : 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                boxShadow: isDark
                  ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
                  : '0 10px 30px -10px rgba(99, 102, 241, 0.1)',
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                  <Tab label="All Tags" sx={{ textTransform: 'none', fontWeight: 600, fontFamily: 'Outfit' }} />
                  <Tab label="Camera & Lens" sx={{ textTransform: 'none', fontWeight: 600, fontFamily: 'Outfit' }} />
                  <Tab label="GPS Data" sx={{ textTransform: 'none', fontWeight: 600, fontFamily: 'Outfit' }} />
                  <Tab label="Other / Raw" sx={{ textTransform: 'none', fontWeight: 600, fontFamily: 'Outfit' }} />
                </Tabs>
              </Box>

              <Box sx={{ p: 3, pb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search tags or values..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <TableContainer sx={{ maxHeight: 350, overflowY: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableBody>
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag) => (
                        <TableRow
                          key={tag.key}
                          sx={{
                            '&:hover': {
                              background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              py: 1.5,
                              color: theme.palette.text.primary,
                              fontFamily: 'JetBrains Mono',
                              fontSize: '0.825rem',
                              width: '40%',
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              background: 'transparent',
                            }}
                          >
                            {tag.key}
                            <Chip
                              label={tag.category}
                              size="small"
                              sx={{
                                ml: 1,
                                fontSize: '0.65rem',
                                height: 16,
                                opacity: 0.8,
                                background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 1.5,
                              fontFamily: 'JetBrains Mono',
                              fontSize: '0.825rem',
                              color: theme.palette.text.secondary,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              background: 'transparent',
                              wordBreak: 'break-all',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span>{tag.value}</span>
                              <Tooltip
                                title={copiedTag === tag.key ? 'Copied!' : 'Copy Value'}
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopy(tag.key, tag.value)}
                                  sx={{ opacity: 0.3, '&:hover': { opacity: 0.8 } }}
                                >
                                  <ContentCopyIcon fontSize="inherit" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                          <InfoIcon color="action" sx={{ mb: 1, opacity: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            No tags found matching "{searchQuery}"
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ p: 1.5, px: 3, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Showing {filteredTags.length} of {tagList.length} total metadata tags.
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
