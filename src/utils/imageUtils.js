// src/utils/imageUtils.js

/**
 * Check if URL is from Cloudinary
 */
export const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};

/**
 * Get optimized image URL with transformations
 * @param {string} url - The original image URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} options.crop - Crop mode (limit, fill, fit, etc.)
 * @param {number} options.quality - Image quality (auto, 1-100)
 * @param {string} options.format - Image format (auto, jpg, png, webp)
 * @returns {string} Optimized URL
 */
export const getOptimizedImage = (url, options = {}) => {
  if (!url) return null;
  
  // If not Cloudinary, return as is
  if (!isCloudinaryUrl(url)) return url;
  
  const { 
    width = null, 
    height = null, 
    crop = 'limit', 
    quality = 'auto',
    format = 'auto'
  } = options;
  
  const transformations = [];
  
  if (width || height) {
    transformations.push(`c_${crop},w_${width || ''},h_${height || ''}`);
  }
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  if (transformations.length === 0) return url;
  
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
};

/**
 * Get thumbnail image (small, fast loading)
 */
export const getThumbnail = (url) => {
  return getOptimizedImage(url, { width: 100, height: 100, crop: 'fill' });
};

/**
 * Get product listing image (medium)
 */
export const getProductImage = (url) => {
  return getOptimizedImage(url, { width: 300, height: 300, crop: 'limit' });
};

/**
 * Get product detail image (large)
 */
export const getProductDetailImage = (url) => {
  return getOptimizedImage(url, { width: 600, height: 600, crop: 'limit' });
};

/**
 * Get hero/banner image
 */
export const getHeroImage = (url) => {
  return getOptimizedImage(url, { width: 800, height: 800, crop: 'limit' });
};

/**
 * Get image with custom size
 */
export const getImageWithSize = (url, width, height) => {
  return getOptimizedImage(url, { width, height, crop: 'limit' });
};

/**
 * Get image with fill crop (for thumbnails/avatars)
 */
export const getFilledImage = (url, width, height) => {
  return getOptimizedImage(url, { width, height, crop: 'fill' });
};

/**
 * Get image with quality setting
 */
export const getImageWithQuality = (url, quality = 'auto') => {
  return getOptimizedImage(url, { quality });
};