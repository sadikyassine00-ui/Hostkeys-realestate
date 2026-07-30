// Currency conversion and formatting utilities for Hostkeys Real Estate Portal

export type Currency = 'MAD' | 'USD' | 'EUR';

export const EXCHANGE_RATES: Record<Currency, { rate: number; symbol: string; isSuffix: boolean }> = {
  MAD: { rate: 10.10, symbol: 'DH', isSuffix: true },
  USD: { rate: 1.0, symbol: '$', isSuffix: false },
  EUR: { rate: 0.92, symbol: '€', isSuffix: false }
};

/**
 * Formats a base USD price into MAD, USD, or EUR with appropriate symbols and styling.
 * @param usdPrice Price in USD (base currency)
 * @param currency Target currency ('MAD' | 'USD' | 'EUR')
 * @param exchangeRate Optional custom USD to EUR conversion rate (defaults to 0.92 if EUR)
 * @param showPeriod Whether to show '/mo' suffix for rentals
 * @param listingType Type of listing ('buy' | 'rent')
 */
export function formatCurrency(
  usdPrice: number,
  currency: Currency = 'MAD',
  exchangeRate?: number,
  showPeriod: boolean = false,
  listingType: 'buy' | 'rent' = 'buy'
): string {
  const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES.MAD;
  const rate = (currency === 'EUR' && exchangeRate) ? exchangeRate : config.rate;
  const convertedPrice = usdPrice * rate;
  
  // Round to nearest integer for presentation
  const formatted = Math.round(convertedPrice).toLocaleString();
  const suffix = showPeriod && listingType === 'rent' ? '/mo' : '';
  
  if (config.isSuffix) {
    return `${formatted} ${config.symbol}${suffix}`;
  }
  return `${config.symbol}${formatted}${suffix}`;
}

/**
 * Converts a base USD value to MAD, EUR, or USD
 */
export function convertValue(
  usdValue: number,
  currency: Currency = 'MAD',
  exchangeRate?: number
): number {
  const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES.MAD;
  const rate = (currency === 'EUR' && exchangeRate) ? exchangeRate : config.rate;
  return usdValue * rate;
}
