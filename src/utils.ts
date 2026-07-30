// Currency conversion and formatting utilities

/**
 * Formats a base USD price into either USD or EUR with appropriate symbols and styling.
 * @param usdPrice Price in USD (base currency)
 * @param currency Target currency ('USD' | 'EUR')
 * @param exchangeRate Current USD to EUR conversion rate (e.g., 0.92)
 * @param showPeriod Whether to show '/mo' suffix for rentals
 * @param listingType Type of listing ('buy' | 'rent')
 */
export function formatCurrency(
  usdPrice: number,
  currency: 'USD' | 'EUR',
  exchangeRate: number,
  showPeriod: boolean = false,
  listingType: 'buy' | 'rent' = 'buy'
): string {
  const convertedPrice = currency === 'EUR' ? usdPrice * exchangeRate : usdPrice;
  const symbol = currency === 'EUR' ? '€' : '$';
  
  // Round to nearest integer for presentation
  const formatted = Math.round(convertedPrice).toLocaleString();
  const suffix = showPeriod && listingType === 'rent' ? '/mo' : '';
  
  return `${symbol}${formatted}${suffix}`;
}

/**
 * Converts a base USD value to EUR if currency is EUR
 */
export function convertValue(
  usdValue: number,
  currency: 'USD' | 'EUR',
  exchangeRate: number
): number {
  return currency === 'EUR' ? usdValue * exchangeRate : usdValue;
}
