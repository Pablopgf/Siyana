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
                resolve(); // Continuar incluso si falla
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
        
        // Mostrar estadísticas finales
        if (failedCount > 0) {
          console.log(`Image preload completed: ${loadedCount - failedCount} loaded, ${failedCount} failed`);
        } else {
          console.log('All images loaded successfully');
        }
        
        // Tiempo mínimo de visualización
        setTimeout(() => {
          onImagesLoaded();
        }, PRELOAD_CONFIG.MIN_DISPLAY_TIME);
        
      } catch (error) {
        console.error('Error in image preloader:', error);
        // Si hay un error general, continuar de todas formas
        onImagesLoaded();
      }
    };
    
    loadImages();
  }, [onImagesLoaded]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img
        src="/images/syyn.gif"
        alt="Siyana"
        className="w-20 h-20"
      />
    </div>
  );
} 