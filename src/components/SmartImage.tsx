import React, { useEffect, useState } from 'react';
import { getImage } from '../lib/imageStore';

/**
 * Renders an image that may be provided inline (dataUrl) or stored in IndexedDB
 * (imageKey). Falls back gracefully while loading.
 */
export const SmartImage: React.FC<{
  dataUrl?: string;
  imageUrl?: string;
  imageKey?: string;
  alt?: string;
  className?: string;
  downloadName?: string;
  fallback?: React.ReactNode;
}> = ({ dataUrl, imageUrl, imageKey, alt, className, downloadName, fallback }) => {
  const [src, setSrc] = useState<string | undefined>(dataUrl || imageUrl);

  useEffect(() => {
    if (dataUrl) {
      setSrc(dataUrl);
      return;
    }
    if (imageUrl) {
      setSrc(imageUrl);
      return;
    }
    let alive = true;
    setSrc(undefined);
    if (imageKey) {
      getImage(imageKey).then((d) => {
        if (alive) setSrc(d || undefined);
      });
    }
    return () => {
      alive = false;
    };
  }, [dataUrl, imageUrl, imageKey]);

  if (!src) {
    return fallback !== undefined ? <>{fallback}</> : null;
  }

  return (
    <div className="space-y-1">
      <img src={src} alt={alt || 'upload'} className={className} />
      {downloadName && (
        <div>
          <a
            href={src}
            download={downloadName}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#005C9D] hover:bg-[#00487D] text-white text-[10px] font-bold cursor-pointer"
          >
            Download image
          </a>
        </div>
      )}
    </div>
  );
};

export default SmartImage;