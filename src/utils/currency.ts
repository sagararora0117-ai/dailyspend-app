export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

/**
 * The app-wide default currency code, used whenever the user's location/locale
 * cannot be mapped to a supported currency.
 */
export const DEFAULT_CURRENCY_CODE = 'INR';

/**
 * The fixed set of supported currencies. Each entry carries both an ISO 4217
 * currency code (stored internally) and its display symbol (shown in the UI).
 */
export const CURRENCY_METADATA: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
];

export const CURRENCY_BY_CODE: Record<string, CurrencyInfo> = Object.fromEntries(
  CURRENCY_METADATA.map((c) => [c.code, c]),
);

/**
 * Legacy symbol -> ISO code lookup. Keeps backward compatibility with existing
 * users whose currency is stored as a bare symbol (e.g. "$", "₹").
 */
export const CODE_BY_SYMBOL: Record<string, string> = {
  $: 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '¥': 'JPY',
  '₹': 'INR',
  '₽': 'RUB',
};

/** Returns the display symbol for a stored value (ISO code or legacy symbol). */
export const currencySymbol = (value: string | number | boolean | null | undefined): string => {
  if (typeof value !== 'string') return currencySymbol(DEFAULT_CURRENCY_CODE);
  const byCode = CURRENCY_BY_CODE[value];
  if (byCode) return byCode.symbol;
  const mappedCode = CODE_BY_SYMBOL[value];
  if (mappedCode) return CURRENCY_BY_CODE[mappedCode]?.symbol ?? mappedCode;
  return value;
};

/**
 * Normalizes a stored currency value (ISO code or legacy symbol) to an ISO 4217
 * code. Returns null when the value cannot be mapped.
 */
export const toCurrencyCode = (value: string | number | boolean | null | undefined): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (CURRENCY_BY_CODE[trimmed]) return trimmed;
  return CODE_BY_SYMBOL[trimmed] ?? null;
};

// Countries legally using the Euro map to EUR.
const EUROZONE = new Set<string>([
  'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES',
]);

// Non-euro regions that map directly to one of the supported currencies.
const REGION_CURRENCY: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  IN: 'INR',
  JP: 'JPY',
  RU: 'RUB',
};

// Language-only fallbacks (no region part in the locale tag).
const LANGUAGE_CURRENCY: Record<string, string> = {
  en: 'USD',
  hi: 'INR',
  ja: 'JPY',
  ru: 'RUB',
  de: 'EUR',
  fr: 'EUR',
};

/** Parses a BCP-47-style locale tag and returns its region, or null. */
const getRegion = (locale: string): string | null => {
  const cleaned = locale.replace('_', '-').trim();
  if (!cleaned) return null;

  try {
    const parsed = new Intl.Locale(cleaned);
    if (parsed.region) return parsed.region.toUpperCase();
  } catch {
    // Intl.Locale unavailable/unparseable -> fall through to regex
  }

  const match = cleaned.match(/^[a-z]{2,3}(?:[-_]([a-z0-9]{2,4}))?/i);
  if (match && match[1] && /^[a-z]{2}$/i.test(match[1])) {
    return match[1].toUpperCase();
  }

  return null;
};

/**
 * Determines the likely currency from the user's browser locales, preferring
 * the most-specific region. Falls back to the default currency (INR) when
 * nothing can be mapped. Uses browser locale/region info only - it never
 * requests geolocation.
 */
export const detectCurrencyFromLocale = (
  locales?: readonly string[],
): string => {
  const list = locales && locales.length
    ? locales
    : typeof navigator !== 'undefined' && navigator.languages?.length
      ? navigator.languages
      : [];

  if (!list.length) return DEFAULT_CURRENCY_CODE;

  for (const raw of list) {
    const cleaned = raw.replace('_', '-').trim();
    if (!cleaned) continue;
    const lang = cleaned.split('-')[0]?.toLowerCase();

    const region = getRegion(cleaned);
    if (region) {
      if (EUROZONE.has(region)) return 'EUR';
      const code = REGION_CURRENCY[region];
      if (code) return code;
    }

    if (lang && LANGUAGE_CURRENCY[lang]) return LANGUAGE_CURRENCY[lang];
  }

  return DEFAULT_CURRENCY_CODE;
};