import React, { useState, useEffect } from 'react';
import { formatGoogleDriveImageUrl, getGoogleDriveThumbnailUrl, isGoogleDriveUrl } from '../../lib/googleDrive';
import { FALLBACK_IMAGE_URL } from '../Admin/ImagePresetPicker';

interface DriveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
}

/**
 * Universal image component that renders Google Drive, CDN, and local images with automatic fallback
 */
export const DriveImage: React.FC<DriveImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = FALLBACK_IMAGE_URL,
  onError,
  ...props
}) => {
  const [attemptState, setAttemptState] = useState<'primary' | 'thumbnail' | 'fallback'>('primary');
  const [currentSrc, setCurrentSrc] = useState<string>('');

  useEffect(() => {
    setAttemptState('primary');
    if (!src) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    const directUrl = formatGoogleDriveImageUrl(src);
    setCurrentSrc(directUrl || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (attemptState === 'primary' && src && isGoogleDriveUrl(src)) {
      setAttemptState('thumbnail');
      const thumb = getGoogleDriveThumbnailUrl(src, 1600);
      setCurrentSrc(thumb);
    } else if (attemptState !== 'fallback') {
      setAttemptState('fallback');
      setCurrentSrc(fallbackSrc);
      if (onError) onError(e);
    } else if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={currentSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={props.loading || 'lazy'}
      {...props}
    />
  );
};
