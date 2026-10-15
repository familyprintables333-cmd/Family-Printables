export type CurrencyCode = 'USD' | 'INR' | 'PKR' | 'EUR' | 'GBP' | 'AED' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateFromUSD: number;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', rateFromUSD: 1.0, decimals: 2 },
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)', rateFromUSD: 83.5, decimals: 0 },
  PKR: { code: 'PKR', symbol: 'Rs ', label: 'PKR (Rs)', rateFromUSD: 278.0, decimals: 0 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', rateFromUSD: 0.92, decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', rateFromUSD: 0.79, decimals: 2 },
  AED: { code: 'AED', symbol: 'د.إ ', label: 'AED (د.إ)', rateFromUSD: 3.67, decimals: 2 },
  CAD: { code: 'CAD', symbol: '$', label: 'CAD ($)', rateFromUSD: 1.36, decimals: 2 },
};

export function formatCurrency(amountUSD: number, currencyCode: string = 'USD'): string {
  const config = CURRENCIES[currencyCode as CurrencyCode] || CURRENCIES.USD;
  const converted = amountUSD * config.rateFromUSD;

  if (config.decimals === 0) {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${config.symbol}${converted.toFixed(config.decimals)}`;
}
