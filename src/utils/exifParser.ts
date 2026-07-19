import exifr from 'exifr';

export interface ExifData {
  // File details
  fileName: string;
  fileSize: string;
  fileType: string;
  imageWidth?: number;
  imageHeight?: number;

  // Camera details
  make?: string;
  model?: string;
  lensModel?: string;
  software?: string;

  // Exposure details
  exposureTime?: number;
  exposureTimeStr?: string;
  fNumber?: number;
  iso?: number;
  focalLength?: number;
  focalLength35mm?: number;
  exposureBias?: number;
  exposureProgram?: string;
  meteringMode?: string;
  flash?: string;
  whiteBalance?: string;

  // Date taken
  dateTimeOriginal?: Date;
  dateTimeOriginalStr?: string;

  // GPS
  latitude?: number;
  longitude?: number;
  altitude?: number;

  // All parsed raw tags
  rawTags: Record<string, any>;
}

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Map exposure program code to string
const EXPOSURE_PROGRAMS: Record<number, string> = {
  0: 'Not defined',
  1: 'Manual',
  2: 'Normal program',
  3: 'Aperture priority',
  4: 'Shutter priority',
  5: 'Creative program (biased toward depth of field)',
  6: 'Action program (biased toward fast shutter speed)',
  7: 'Portrait mode (for closeup photos with the background out of focus)',
  8: 'Landscape mode (for landscape photos with the background in focus)',
};

// Map metering mode code to string
const METERING_MODES: Record<number, string> = {
  0: 'Unknown',
  1: 'Average',
  2: 'Center-weighted average',
  3: 'Spot',
  4: 'Multi-spot',
  5: 'Pattern / Multi-segment',
  6: 'Partial',
  255: 'Other',
};

// Format shutter speed (e.g. 0.008s -> 1/125s)
export function formatShutterSpeed(seconds?: number): string {
  if (seconds === undefined) return '';
  if (seconds >= 1) {
    return `${parseFloat(seconds.toFixed(2))}s`;
  }
  const fraction = Math.round(1 / seconds);
  return `1/${fraction}s`;
}

// Parse flash value
function parseFlash(flashVal: any): string {
  if (flashVal === undefined || flashVal === null) return 'Unknown';
  if (typeof flashVal === 'object' && flashVal.value !== undefined) {
    flashVal = flashVal.value;
  }
  if (typeof flashVal === 'number') {
    // Standard EXIF flash flags
    const fired = (flashVal & 1) !== 0;
    const mode = (flashVal >> 3) & 3;
    const redEye = (flashVal >> 6) & 1;

    let desc = fired ? 'Fired' : 'Did not fire';
    if (mode === 1) desc += ' (compulsory flash fire)';
    if (mode === 2) desc += ' (compulsory flash suppression)';
    if (mode === 3) desc += ' (auto mode)';
    if (redEye === 1) desc += ', red-eye reduction';
    return desc;
  }
  return String(flashVal);
}

// Parse white balance
function parseWhiteBalance(wbVal: any): string {
  if (wbVal === undefined || wbVal === null) return 'Unknown';
  if (wbVal === 0) return 'Auto';
  if (wbVal === 1) return 'Manual';
  return String(wbVal);
}

export async function parseImageMetadata(file: File): Promise<ExifData> {
  // Parse all metadata blocks supported by exifr
  const rawTags = await exifr.parse(file, {
    tiff: true,
    xmp: true,
    iptc: true,
    jfif: true,
    icc: true,
    gps: true,
    mergeOutput: true, // merge everything into one object
  }).catch(() => ({})) || {};

  // Parse GPS separately to ensure we get decimal coordinates
  const gps = await exifr.gps(file).catch(() => null);

  const exposureTime = rawTags.ExposureTime || rawTags.ShutterSpeedValue;

  const data: ExifData = {
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    fileType: file.type || file.name.split('.').pop()?.toUpperCase() || 'Unknown',
    imageWidth: rawTags.ImageWidth || rawTags.ExifImageWidth,
    imageHeight: rawTags.ImageHeight || rawTags.ExifImageHeight,

    make: rawTags.Make?.trim(),
    model: rawTags.Model?.trim(),
    lensModel: rawTags.LensModel || rawTags.LensInfo || rawTags.Lens?.trim(),
    software: rawTags.Software?.trim(),

    exposureTime,
    exposureTimeStr: formatShutterSpeed(exposureTime),
    fNumber: rawTags.FNumber || rawTags.ApertureValue,
    iso: rawTags.ISO || rawTags.ISOSpeedRatings?.[0] || rawTags.ISOSpeedRatings,
    focalLength: rawTags.FocalLength,
    focalLength35mm: rawTags.FocalLengthIn35mmFormat || rawTags.FocalLengthIn35mmFilm,
    exposureBias: rawTags.ExposureBiasValue,
    exposureProgram: EXPOSURE_PROGRAMS[rawTags.ExposureProgram] || rawTags.ExposureProgram,
    meteringMode: METERING_MODES[rawTags.MeteringMode] || rawTags.MeteringMode,
    flash: parseFlash(rawTags.Flash),
    whiteBalance: parseWhiteBalance(rawTags.WhiteBalance),

    dateTimeOriginal: rawTags.DateTimeOriginal ? new Date(rawTags.DateTimeOriginal) : undefined,
    dateTimeOriginalStr: rawTags.DateTimeOriginal
      ? new Date(rawTags.DateTimeOriginal).toLocaleString()
      : undefined,

    latitude: gps?.latitude,
    longitude: gps?.longitude,
    altitude: rawTags.GPSAltitude,

    rawTags,
  };

  return data;
}
