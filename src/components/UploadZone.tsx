import React, { useState, useRef } from 'react';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  error?: string | null;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, error }) => {
  const theme = useTheme();
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      <Paper
        variant="outlined"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive
            ? theme.palette.primary.main
            : error
            ? theme.palette.error.main
            : isDark
            ? alpha(theme.palette.divider, 0.4)
            : alpha(theme.palette.divider, 0.8),
          borderRadius: 4,
          padding: { xs: 4, md: 6 },
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          background: isDragActive
            ? alpha(theme.palette.primary.main, 0.04)
            : isDark
            ? 'rgba(30, 41, 59, 0.3)'
            : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(8px)',
          boxShadow: isDragActive
            ? `0 12px 24px -10px ${alpha(theme.palette.primary.main, 0.2)}`
            : 'none',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            background: alpha(theme.palette.primary.main, 0.02),
            boxShadow: `0 8px 16px -8px ${alpha(theme.palette.primary.main, 0.15)}`,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: isDragActive
                ? alpha(theme.palette.primary.main, 0.15)
                : isDark
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.primary.main, 0.06),
              color: theme.palette.primary.main,
              transition: 'transform 0.3s ease',
              transform: isDragActive ? 'scale(1.1) translateY(-4px)' : 'none',
            }}
          >
            {isDragActive ? (
              <CloudUploadIcon sx={{ fontSize: 36 }} />
            ) : (
              <ImageIcon sx={{ fontSize: 36 }} />
            )}
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 0.5, fontFamily: 'Outfit', fontWeight: 600 }}>
              Drag & Drop your photo here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>browse files</span> from your device
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Supports JPG, JPEG, PNG, WEBP, HEIC, TIFF, etc.
            <br />
            No images are uploaded to any server. All processing runs completely offline.
          </Typography>

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 500 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
