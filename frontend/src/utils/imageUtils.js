/**
 * Get full image URL from relative path
 * @param {string} path - Relative image path from backend
 * @returns {string} - Full image URL or placeholder
 */
export const getImageUrl = (path) => {
  if (!path) return '/default-placeholder.png';
  
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get backend base URL from env or use default
  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  
  // Remove leading slash if present since backendUrl should not have trailing slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${backendUrl}${cleanPath}`;
};

/**
 * Get avatar URL with fallback
 * @param {string} avatarPath - Avatar path
 * @param {string} defaultAvatar - Default avatar to use
 * @returns {string} - Avatar URL
 */
export const getAvatarUrl = (avatarPath, defaultAvatar = '/default-avatar.png') => {
  if (!avatarPath) return defaultAvatar;
  return getImageUrl(avatarPath);
};

/**
 * Get media URL for posts/products
 * @param {Object|string} media - Media object or string path
 * @returns {string} - Media URL
 */
export const getMediaUrl = (media) => {
  if (!media) return '/default-placeholder.png';
  
  // If media is a string, it's already a path
  if (typeof media === 'string') {
    return getImageUrl(media);
  }
  
  // If media is an object with url property
  if (media.url) {
    return getImageUrl(media.url);
  }
  
  return '/default-placeholder.png';
};

/**
 * Check if image URL is valid and accessible
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} - True if image is accessible
 */
export const isImageAccessible = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
