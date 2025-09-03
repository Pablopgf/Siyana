// Configuración de imágenes para preloadear
export const PRELOAD_IMAGES = {
  // Imágenes de productos (prioridad alta)
  PRODUCTS: [
    '/images/SIYANA BASIC PILL TEE MOCKUP BLACK.png',
    '/images/icon.png',
    '/images/icon.png',
    '/images/icon.png',
  ],
  
  // Imágenes de la aplicación (prioridad alta)
  APP_ESSENTIAL: [
    '/images/syyn.gif',
    '/images/siyana.png',
    '/images/feed.jpg',
    '/images/feed.png',
    '/images/splash.png',
  ],
  
  // Otras imágenes importantes (prioridad media)
  APP_IMPORTANT: [
    '/images/background.png',
    '/images/base.png',
    '/images/yellow_bird.gif',
    '/images/syyn_white.gif',
  ],
  
  // Obtener todas las imágenes en orden de prioridad
  getAll: () => [
    ...PRELOAD_IMAGES.PRODUCTS,
    ...PRELOAD_IMAGES.APP_ESSENTIAL,
    ...PRELOAD_IMAGES.APP_IMPORTANT,
  ],
  
  // Obtener solo imágenes de productos
  getProducts: () => PRELOAD_IMAGES.PRODUCTS,
  
  // Obtener solo imágenes esenciales de la app
  getEssential: () => PRELOAD_IMAGES.APP_ESSENTIAL,
};

// Configuración de preload
export const PRELOAD_CONFIG = {
  // Tiempo mínimo de visualización del preloader (ms)
  MIN_DISPLAY_TIME: 500,
  
  // Tiempo máximo de espera antes de continuar (ms)
  MAX_WAIT_TIME: 10000,
  
  // Mostrar progreso detallado
  SHOW_DETAILED_PROGRESS: true,
  
  // Continuar si fallan algunas imágenes
  CONTINUE_ON_ERROR: true,
}; 