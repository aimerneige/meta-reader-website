# Meta Reader Website Development Plan

This project is an EXIF reader web application built with React, Material-UI (MUI), and Vite, optimized for deployment on GitHub Pages.

## Core Rules & Requirements

1. **Design System**: Strictly adhere to Material Design using `@mui/material`, `@mui/icons-material`, and `@emotion/react` / `@emotion/styled`.
2. **Key Feature**:
   - Image upload interface (drag & drop + file picker).
   - Read image metadata (EXIF, IPTC, XMP if possible) client-side.
   - Visually rich, clean, and organized presentation of metadata (e.g., Camera Model, Lens, Exposure, ISO, GPS coordinates with a map link, etc.).
3. **Deployment target**: GitHub Pages (static site).
   - Needs to build into a static bundle.
   - Must be configured for routing and assets correctly under a subdirectory if deployed as a project page (e.g., `/meta-reader-website/` base path).
4. **Bundle Size Optimization**:
   - Keep compiled files small to comply with GitHub Pages limitations and optimize loading speeds.
   - Use a lightweight, fast EXIF parsing library like `exifr` or `exif-js`.
   - Tree-shake MUI components and icons.
5. **Development Framework**: React + Vite (for fast builds and lightweight output).

## Implementation Steps

1. **Project Initialization**: Initialize a React + TS (TypeScript) project using Vite in the current folder.
2. **Install Dependencies**: Install MUI, MUI Icons, and an EXIF parser library (e.g., `exifr`).
3. **App Architecture**:
   - **ExifReader**: Core service/utility to parse metadata.
   - **UploadZone**: Drag & drop image upload area with Material-UI styling.
   - **MetadataViewer**: Clean dashboard showing camera specs, exposure details, location, and raw tags.
   - **Footer & Header**: Material Design App Bar with theme toggling (Light/Dark mode).
4. **Build & GitHub Pages Configuration**: Configure Vite build settings (`base` path, asset optimization, etc.).
5. **Testing and Verification**: Verify build outputs and confirm sizes.
