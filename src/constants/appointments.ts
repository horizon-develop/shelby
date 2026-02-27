// Price formatting helper (cents to display)
export const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toLocaleString()}`;
};
