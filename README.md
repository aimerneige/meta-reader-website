# 📷 Meta Reader

A modern, fast, and **100% private** client-side image metadata (EXIF, IPTC, XMP) parser and visual dashboard. Built with React 19, Material-UI (MUI), and Vite.

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![MUI](https://img.shields.io/badge/MUI-9.2-007FFF?logo=mui&logoColor=white)](https://mui.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Client--side-success?logo=dynamic&logoColor=white)](#-privacy-first)

---

## ✨ Features

- **🔒 Privacy First**: All parsing is executed directly in your browser. No files, metadata, or coordinates are ever uploaded to a server.
- **⚡ Fast Parsing**: Leverages the lightweight and high-performance `exifr` library to read TIFF, XMP, IPTC, JFIF, ICC, and GPS tags instantly.
- **📊 Exposure Triangle Visualizer**: Beautiful dashboard display highlighting:
  - **Aperture** (`ƒ/` stop)
  - **Shutter Speed** (fractional/decimal seconds)
  - **ISO Sensitivity**
  - **Focal Length** (with 35mm equivalent conversion)
- **🗺️ GPS Location Mapping**: Extracts coordinates and embeds an interactive OpenStreetMap view, complete with direct links to Google Maps and OpenStreetMap.
- **🔍 Comprehensive Tag Inspector**:
  - Filterable by categories (Camera & Lens, GPS, Raw EXIF, etc.)
  - Interactive search bar to find specific keys or values
  - One-click copy for any tag value
- **🌓 Adaptive Theme**: Sleek Material Design 3 interface with full Light and Dark mode options.
- **📱 Fully Responsive**: Seamless experience across mobile, tablet, and desktop viewports.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **UI & Icons**: [Material-UI (MUI v9)](https://mui.com/) & [@mui/icons-material](https://mui.com/material-ui/material-icons/)
- **EXIF Engine**: [exifr](https://github.com/MikeKovacik/exifr)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter)

---

## 📂 Project Structure

```text
meta-reader-website/
├── src/
│   ├── components/
│   │   ├── MetadataViewer.tsx  # Dashboard layout, exposure badges, map, and tag list
│   │   └── UploadZone.tsx      # Drag-and-drop / file picker component
│   ├── utils/
│   │   └── exifParser.ts       # Service wrapper for exifr config and formatting logic
│   ├── App.tsx                 # Main layout, theme settings, and state machine
│   ├── main.tsx                # Application root entrypoint
│   └── index.css               # Global typography and animations
├── public/                     # Static assets
├── deploy.sh                   # GitHub Pages deployment automation script
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) and [npm](https://www.npmjs.com/) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AimerNeige/meta-reader-website.git
   cd meta-reader-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server locally:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Build

Compile and bundle the production assets:
```bash
npm run build
```
The optimized build output will be stored in the `dist` directory.

### Linting

Run Oxlint to check code quality and rules:
```bash
npm run lint
```

---

## 🌐 Deployment

The application is optimized for static hosting (e.g. GitHub Pages). You can deploy the build folder using the provided deploy script:

```bash
chmod +x deploy.sh
./deploy.sh
```

This script will automatically clear previous builds, run `npm run build`, and force-push the static bundle in the `dist` folder to your target deployment repository.

---

## 🔒 Privacy First

We believe that your photos and their metadata are personal. 

- **No Server Processing**: Every line of metadata extraction code runs inside your local browser runtime.
- **No Analytics Tracking**: We do not collect analytics, logs, or track coordinates.
- **Offline Capable**: Once loaded, the application can run entirely without an active internet connection.

---

## 📄 License

This project is licensed under the MIT License. Feel free to copy, modify, or distribute it as needed.
