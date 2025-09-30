'use client'

import { useEffect, useState } from 'react'
import { PRELOAD_IMAGES, PRELOAD_CONFIG } from '@/lib/imageConfig'

interface ImagePreloaderProps {
  onImagesLoaded: () => void
}

export default function ImagePreloader({ onImagesLoaded }: ImagePreloaderProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagesToLoad = PRELOAD_IMAGES.getAll();
        let loadedCount = 0;
        let failedCount = 0;
        
        for (let i = 0; i < imagesToLoad.length; i++) {
          const imageUrl = imagesToLoad[i];
          
          try {
            await new Promise<void>((resolve, reject) => {
              const img = new Image();
              
              const timeout = setTimeout(() => {
                console.warn(`Timeout loading image: ${imageUrl}`);
                failedCount++;
                loadedCount++;
                setLoadingProgress((loadedCount / imagesToLoad.length) * 100);
                resolve();
              }, 5000);
              
              img.onload = () => {
                clearTimeout(timeout);
                loadedCount++;
                setLoadingProgress((loadedCount / imagesToLoad.length) * 100);
                resolve();
              };
              
              img.onerror = () => {
                clearTimeout(timeout);
                console.warn(`Failed to load image: ${imageUrl}`);
                failedCount++;
                loadedCount++;
                setLoadingProgress((loadedCount / imagesToLoad.length) * 100);
                resolve();
              };
              
              img.src = imageUrl;
            });
          } catch (error) {
            console.warn(`Error loading image ${imageUrl}:`, error);
            failedCount++;
            loadedCount++;
            setLoadingProgress((loadedCount / imagesToLoad.length) * 100);
          }
        }
        
        if (failedCount > 0) {
          console.log(`Image preload completed: ${loadedCount - failedCount} loaded, ${failedCount} failed`);
        } else {
          console.log('All images loaded successfully');
        }
        
        setTimeout(() => {
          onImagesLoaded();
        }, PRELOAD_CONFIG.MIN_DISPLAY_TIME);
        
      } catch (error) {
        console.error('Error in image preloader:', error);
        onImagesLoaded();
      }
    };
    
    loadImages();
  }, [onImagesLoaded]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-64">
      <img
        src="/images/SIYANA LOGO PANTALLA CARGA MINIAPP.png"
        alt="Siyana"
        className="w-32 h-32"
      />
    </div>
  );
} 