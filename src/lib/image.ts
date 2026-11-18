// Image upload helpers: accept up to 50 MB at high quality, return a data URL
// the admin can view and download.

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

export interface ProcessedImage {
  dataUrl: string;
  name: string;
  size: number;
  width: number;
  height: number;
}

export function isAllowedImage(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Reads an image file (up to 50 MB), keeps detail (default max 1600px, q=0.9)
 * and resolves with a data URL plus metadata.
 */
export function processImageFile(
  file: File,
  opts: { maxDim?: number; quality?: number } = {}
): Promise<ProcessedImage> {
  const maxDim = opts.maxDim ?? 1600;
  const quality = opts.quality ?? 0.9;

  return new Promise((resolve, reject) => {
    if (!isAllowedImage(file)) {
      reject(new Error('Please upload an image file (JPG, PNG, etc.).'));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      reject(new Error('Image is larger than 50 MB. Please upload a smaller file.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      const src = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: src, name: file.name, size: file.size, width: img.width, height: img.height });
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', quality), name: file.name, size: file.size, width: w, height: h });
      };
      img.onerror = () => resolve({ dataUrl: src, name: file.name, size: file.size, width: 0, height: 0 });
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function humanFileSize(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
