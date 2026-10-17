/**
 * ============================================================================
 * Centralized Image Asset Catalog & Netlify-Safe Universal Image Resolver
 * ============================================================================
 * 
 * Works seamlessly across:
 * 1. Local Vite development server (`npm run dev`)
 * 2. Production build (`npm run build`)
 * 3. Netlify live deployment (dist directory publish)
 * 4. Self-editing: easily reference images by object `IMAGES.coverPuzzles`,
 *    or by convenient alias string `'cover_puzzles'`, `'cover_ramadan'`, etc.,
 *    or by relative path `/assets/images/cover_puzzles.jpg`.
 * ============================================================================
 */

// Direct ES Module imports - Vite will bundle and hash these into /dist/assets/
import coverToddlerPreschool from './cover_toddler_preschool_1791896015426.jpg';
import productKidsWorkbook from './product_kids_workbook_1791829243098.jpg';
import coverPuzzlesBrain from './cover_puzzles_brain_1791896015957.jpg';
import productFamilyRoutineBoard from './product_family_routine_board_1791829276295.jpg';
import coverRamadanHoliday from './cover_ramadan_holiday_1791896015891.jpg';
import festivalsGreetingCards from './festivals_greeting_cards_1791903827189.jpg';
import seasonalHolidaysPoster from './seasonal_holidays_poster_1792151772339.jpg';
import productBedtimeEbook from './product_bedtime_ebook_1791829261806.jpg';
import heroFamilyPrintables from './hero_family_printables_1791829224882.jpg';
import officialBrandLogo from './official_brand_logo_1791979048406.jpg';

export const IMAGES = {
  // Primary Product & Category Cover Art (Bundled Assets)
  coverToddler: coverToddlerPreschool,
  coverPreschool: coverToddlerPreschool,
  productKidsWorkbook: productKidsWorkbook,
  coverPuzzles: coverPuzzlesBrain,
  productRoutineBoard: productFamilyRoutineBoard,
  coverRamadan: coverRamadanHoliday,
  festivalsCards: festivalsGreetingCards,
  coverSeasonalHolidays: seasonalHolidaysPoster,
  coverFestivals: seasonalHolidaysPoster,
  productBedtime: productBedtimeEbook,
  heroBanner: heroFamilyPrintables,
  officialLogo: officialBrandLogo,

  // Direct public URL references (guaranteed in /public/assets/images/ for Netlify)
  publicUrls: {
    toddler: '/assets/images/cover_toddler.jpg',
    earlyLearning: '/assets/images/product_kids_workbook.jpg',
    puzzles: '/assets/images/cover_puzzles.jpg',
    routine: '/assets/images/product_family_routine_board.jpg',
    ramadan: '/assets/images/cover_ramadan.jpg',
    festivals: '/assets/images/seasonal_holidays_poster.jpg',
    seasonal: '/assets/images/seasonal_holidays_poster.jpg',
    bedtime: '/assets/images/product_bedtime_ebook.jpg',
    hero: '/assets/images/hero_family_printables.jpg',
    logo: '/assets/images/official_brand_logo.jpg',
  }
};

/**
 * Friendly name dictionary to map user-typed strings, filenames, and aliases
 * directly to the compiled asset bundle.
 */
const ASSET_REGISTRY: Record<string, string> = {
  // Toddler
  cover_toddler: coverToddlerPreschool,
  cover_toddler_preschool: coverToddlerPreschool,
  'cover_toddler.jpg': coverToddlerPreschool,
  'cover_toddler_preschool_1791896015426.jpg': coverToddlerPreschool,
  toddler: coverToddlerPreschool,

  // Early Learning
  product_kids_workbook: productKidsWorkbook,
  'product_kids_workbook.jpg': productKidsWorkbook,
  'product_kids_workbook_1791829243098.jpg': productKidsWorkbook,
  early_learning: productKidsWorkbook,
  kids_workbook: productKidsWorkbook,

  // Puzzles & Brain Teasers
  cover_puzzles: coverPuzzlesBrain,
  cover_puzzles_brain: coverPuzzlesBrain,
  'cover_puzzles.jpg': coverPuzzlesBrain,
  'cover_puzzles_brain_1791896015957.jpg': coverPuzzlesBrain,
  puzzles: coverPuzzlesBrain,

  // Routine & Planning
  product_family_routine_board: productFamilyRoutineBoard,
  'product_family_routine_board.jpg': productFamilyRoutineBoard,
  'product_family_routine_board_1791829276295.jpg': productFamilyRoutineBoard,
  routine: productFamilyRoutineBoard,
  routine_board: productFamilyRoutineBoard,

  // Ramadan & Eid
  cover_ramadan: coverRamadanHoliday,
  cover_ramadan_holiday: coverRamadanHoliday,
  'cover_ramadan.jpg': coverRamadanHoliday,
  'cover_ramadan_holiday_1791896015891.jpg': coverRamadanHoliday,
  ramadan: coverRamadanHoliday,
  ramadan_eid: coverRamadanHoliday,

  // Seasonal & Holidays
  cover_seasonal_holidays: seasonalHolidaysPoster,
  seasonal_holidays_poster: seasonalHolidaysPoster,
  'seasonal_holidays_poster.jpg': seasonalHolidaysPoster,
  'seasonal_holidays_poster_1792151772339.jpg': seasonalHolidaysPoster,
  seasonal: seasonalHolidaysPoster,
  holidays: seasonalHolidaysPoster,

  // Festivals & Greeting Cards
  festivals_greeting_cards: festivalsGreetingCards,
  'festivals_greeting_cards.jpg': festivalsGreetingCards,
  'festivals_greeting_cards_1791903827189.jpg': festivalsGreetingCards,
  festivals: festivalsGreetingCards, // Elegant all-occasion Greeting Cards banner
  greeting_cards: festivalsGreetingCards,

  // Bedtime Audio & eBook
  product_bedtime_ebook: productBedtimeEbook,
  'product_bedtime_ebook.jpg': productBedtimeEbook,
  'product_bedtime_ebook_1791829261806.jpg': productBedtimeEbook,
  bedtime: productBedtimeEbook,

  // Hero & Brand Logo
  hero_family_printables: heroFamilyPrintables,
  'hero_family_printables.jpg': heroFamilyPrintables,
  'hero_family_printables_1791829224882.jpg': heroFamilyPrintables,
  hero: heroFamilyPrintables,
  official_brand_logo: officialBrandLogo,
  'official_brand_logo.jpg': officialBrandLogo,
  'official_brand_logo_1791979048406.jpg': officialBrandLogo,
  logo: officialBrandLogo,
};

/**
 * Universal safe helper to resolve any image string into a 100% working URL
 * on localhost, Netlify, or any production static CDN.
 */
export function resolveImageUrl(path: string | undefined, contextCategory?: string): string {
  // If context category indicates seasonal/festivals/greeting cards, return dedicated elegant Greeting Cards banner
  if (!path) {
    if (contextCategory === 'festivals' || contextCategory === 'seasonal' || contextCategory?.includes('cards')) {
      return festivalsGreetingCards;
    }
    return coverToddlerPreschool;
  }

  // 1. If it's already an active data URL or absolute web URL, return as-is
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 2. Contextual check for greeting cards, seasonal & ramadan printables in path or category
  const lowerPath = path.toLowerCase();
  if (
    lowerPath.includes('greeting') ||
    lowerPath.includes('cards') ||
    lowerPath.includes('festival') || 
    contextCategory === 'festivals'
  ) {
    return festivalsGreetingCards;
  }
  if (lowerPath.includes('ramadan') || lowerPath.includes('seasonal')) {
    return coverRamadanHoliday;
  }

  // 3. Strip leading paths to extract the base name (e.g. "src/assets/images/cover_puzzles.jpg" -> "cover_puzzles.jpg")
  const cleanKey = path
    .replace(/^(\.\/|\/)?(src\/)?assets\/images\//, '')
    .trim();

  // Check registry for direct match or without file extension
  if (ASSET_REGISTRY[cleanKey]) {
    return ASSET_REGISTRY[cleanKey];
  }
  const keyWithoutExt = cleanKey.replace(/\.[^/.]+$/, '');
  if (ASSET_REGISTRY[keyWithoutExt]) {
    return ASSET_REGISTRY[keyWithoutExt];
  }

  // 4. Fallback to public assets directory path
  if (path.startsWith('/src/assets/images/')) {
    return path.replace('/src/assets/images/', '/assets/images/');
  }
  if (path.startsWith('src/assets/images/')) {
    return '/' + path.replace('src/assets/images/', 'assets/images/');
  }

  return path;
}
