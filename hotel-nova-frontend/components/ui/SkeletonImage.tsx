'use client';

import { useState } from 'react';
import NextImage, { ImageProps } from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkeletonImageProps extends ImageProps {
  wrapperClassName?: string;
}

export function SkeletonImage({
  wrapperClassName = '',
  className = '',
  alt,
  ...props
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const positionClass = props.fill ? 'absolute inset-0' : 'relative w-full h-full';

  return (
    <div className={`${positionClass} overflow-hidden ${wrapperClassName}`}>
      {!isLoaded && (
        <div className="absolute inset-0 z-0 bg-gray-200 animate-pulse">
          <Skeleton
             className="block h-full w-full! object-cover" 
             style={{ height: '100%', width: '100%', borderRadius: 0 }}
             baseColor="#e2e8f0" 
             highlightColor="#f8fafc"
          />
        </div>
      )}
      <NextImage
        {...props}
        alt={alt || ''}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={(e) => {
          setIsLoaded(true);
          if (props.onLoad) {
            props.onLoad(e);
          }
        }}
      />
    </div>
  );
}
