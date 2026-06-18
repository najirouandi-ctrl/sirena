export const formatPrice = (price: number): string => {
  return `${price} DH`;
};

// Si tu veux avec séparateur de milliers plus tard :
export const formatPriceWithSpace = (price: number): string => {
  return `${price.toLocaleString('fr-FR')} DH`;
};