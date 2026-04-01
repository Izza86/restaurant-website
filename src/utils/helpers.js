/**
 * Utility: Format a price as USD currency string.
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Utility: Truncate text to a maximum length with ellipsis.
 */
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
};

/**
 * Utility: Generate a class string from conditional class objects.
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
