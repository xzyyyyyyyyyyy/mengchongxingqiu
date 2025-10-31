/**
 * Check if a user owns a resource
 * @param {Object} user - Current user object
 * @param {Object} resource - Resource with author/owner field
 * @param {string} ownerField - Name of the owner field (default: 'author')
 * @returns {boolean} - True if user owns the resource
 */
export const isOwner = (user, resource, ownerField = 'author') => {
  if (!user || !resource) return false;
  
  const userId = user._id || user.id;
  const ownerId = resource[ownerField]?._id || resource[ownerField]?.id || resource[ownerField];
  
  return userId && ownerId && userId.toString() === ownerId.toString();
};

/**
 * Get user ID in a consistent way
 * @param {Object} user - User object
 * @returns {string|null} - User ID or null
 */
export const getUserId = (user) => {
  return user?._id || user?.id || null;
};
