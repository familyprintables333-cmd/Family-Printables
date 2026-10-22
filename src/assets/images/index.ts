/**
 * ============================================================================
 * Centralized Image Asset Catalog & Universal Bundled Image Resolver
 * ============================================================================
 * 
 * Works seamlessly across:
 * 1. Local Vite development server (`npm run dev`)
 * 2. Production build (`npm run build`)
 * 3. Vercel, Netlify, or any static host (bundled directly into dist/assets)
 * 4. Self-editing: easily reference images by object `IMAGES.coverPuzzles`,
 *    or by convenient alias string `'cover_puzzles'`, `'cover_ramadan'`, etc.,
 *    or by relative path `/assets/images/cover_puzzles.jpg`.
 * ============================================================================
 */

// Direct ES Module imports using lightweight WebP formats (Vite bundles these into /dist/assets/)
import coverToddlerPreschool from './cover_toddler_preschool_1791896015426.webp';
import productKidsWorkbook from './product_kids_workbook_1791829243098.webp';
import coverPuzzlesBrain from './cover_puzzles_brain_1791896015957.webp';
import productFamilyRoutineBoard from './product_family_routine_board_1791829276295.webp';
import coverRamadanHoliday from './cover_ramadan_holiday_1791896015891.webp';
import festivalsGreetingCards from './festivals_greeting_cards_1791903827189.webp';
import seasonalHolidaysPoster from './seasonal_holidays_poster_1792151772339.webp';
import productBedtimeEbook from './product_bedtime_ebook_1791829261806.webp';
import heroFamilyPrintables from './hero_family_printables_1791829224882.webp';
import officialBrandLogo from './official_brand_logo_1791979048406.webp';
import elitePlannersGuide from './elite_planners_guide.svg';

export const IMAGES = {
  // Primary Product & Category Cover Art (Bundled Assets)
  coverToddler: coverToddlerPreschool,
  coverPreschool: coverToddlerPreschool,
  productKidsWorkbook: productKidsWorkbook,
  coverPuzzles: coverPuzzlesBrain,
  productRoutineBoard: productFamilyRoutineBoard,
  coverElitePlanners: elitePlannersGuide,
  productElitePlanners: elitePlannersGuide,
  coverRamadan: coverRamadanHoliday,
  festivalsCards: festivalsGreetingCards,
  coverSeasonalHolidays: seasonalHolidaysPoster,
  coverFestivals: seasonalHolidaysPoster,
  productBedtime: productBedtimeEbook,
  heroBanner: heroFamilyPrintables,
  officialLogo: officialBrandLogo,
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
  'cover_toddler.webp': coverToddlerPreschool,
  'cover_toddler_preschool_1791896015426.jpg': coverToddlerPreschool,
  'cover_toddler_preschool_1791896015426.webp': coverToddlerPreschool,
  toddler: coverToddlerPreschool,

  // Early Learning
  product_kids_workbook: productKidsWorkbook,
  'product_kids_workbook.jpg': productKidsWorkbook,
  'product_kids_workbook.webp': productKidsWorkbook,
  'product_kids_workbook_1791829243098.jpg': productKidsWorkbook,
  'product_kids_workbook_1791829243098.webp': productKidsWorkbook,
  early_learning: productKidsWorkbook,
  kids_workbook: productKidsWorkbook,

  // Puzzles & Brain Teasers
  cover_puzzles: coverPuzzlesBrain,
  cover_puzzles_brain: coverPuzzlesBrain,
  'cover_puzzles.jpg': coverPuzzlesBrain,
  'cover_puzzles.webp': coverPuzzlesBrain,
  'cover_puzzles_brain_1791896015957.jpg': coverPuzzlesBrain,
  'cover_puzzles_brain_1791896015957.webp': coverPuzzlesBrain,
  puzzles: coverPuzzlesBrain,

  // Routine & Planning
  product_family_routine_board: productFamilyRoutineBoard,
  'product_family_routine_board.jpg': productFamilyRoutineBoard,
  'product_family_routine_board.webp': productFamilyRoutineBoard,
  'product_family_routine_board_1791829276295.jpg': productFamilyRoutineBoard,
  'product_family_routine_board_1791829276295.webp': productFamilyRoutineBoard,
  routine: productFamilyRoutineBoard,
  routine_board: productFamilyRoutineBoard,
  elite_planners_guide: elitePlannersGuide,
  'elite_planners_guide.svg': elitePlannersGuide,

  // Ramadan & Eid
  cover_ramadan: coverRamadanHoliday,
  cover_ramadan_holiday: coverRamadanHoliday,
  'cover_ramadan.jpg': coverRamadanHoliday,
  'cover_ramadan.webp': coverRamadanHoliday,
  'cover_ramadan_holiday_1791896015891.jpg': coverRamadanHoliday,
  'cover_ramadan_holiday_1791896015891.webp': coverRamadanHoliday,
  ramadan: coverRamadanHoliday,
  ramadan_eid: coverRamadanHoliday,

  // Seasonal & Holidays
  cover_seasonal_holidays: seasonalHolidaysPoster,
  seasonal_holidays_poster: seasonalHolidaysPoster,
  'seasonal_holidays_poster.jpg': seasonalHolidaysPoster,
  'seasonal_holidays_poster.webp': seasonalHolidaysPoster,
  'seasonal_holidays_poster_1792151772339.jpg': seasonalHolidaysPoster,
  'seasonal_holidays_poster_1792151772339.webp': seasonalHolidaysPoster,
  seasonal: seasonalHolidaysPoster,
  holidays: seasonalHolidaysPoster,

  // Festivals & Greeting Cards
  festivals_greeting_cards: festivalsGreetingCards,
  'festivals_greeting_cards.jpg': festivalsGreetingCards,
  'festivals_greeting_cards.webp': festivalsGreetingCards,
  'festivals_greeting_cards_1791903827189.jpg': festivalsGreetingCards,
  'festivals_greeting_cards_1791903827189.webp': festivalsGreetingCards,
  festivals: festivalsGreetingCards,
  greeting_cards: festivalsGreetingCards,

  // Bedtime Audio & eBook
  product_bedtime_ebook: productBedtimeEbook,
  'product_bedtime_ebook.jpg': productBedtimeEbook,
  'product_bedtime_ebook.webp': productBedtimeEbook,
  'product_bedtime_ebook_1791829261806.jpg': productBedtimeEbook,
  'product_bedtime_ebook_1791829261806.webp': productBedtimeEbook,
  bedtime: productBedtimeEbook,

  // Hero & Brand Logo
  hero_family_printables: heroFamilyPrintables,
  'hero_family_printables.jpg': heroFamilyPrintables,
  'hero_family_printables.webp': heroFamilyPrintables,
  'hero_family_printables_1791829224882.jpg': heroFamilyPrintables,
  'hero_family_printables_1791829224882.webp': heroFamilyPrintables,
  hero: heroFamilyPrintables,
  official_brand_logo: officialBrandLogo,
  'official_brand_logo.jpg': officialBrandLogo,
  'official_brand_logo.webp': officialBrandLogo,
  'official_brand_logo_1791979048406.jpg': officialBrandLogo,
  'official_brand_logo_1791979048406.webp': officialBrandLogo,
  logo: officialBrandLogo,
};

/**
 * Universal safe helper to resolve any image string into a 100% working URL
 * on localhost, Vercel, Netlify, or any production static CDN.
 */
export function resolveImageUrl(path: string | undefined, contextCategory?: string): string {
  if (!path) {
    if (contextCategory === 'festivals' || contextCategory === 'seasonal' || contextCategory?.includes('cards')) {
      return festivalsGreetingCards;
    }
    return coverToddlerPreschool;
  }

  // 1. If it's already an active data URL, absolute web URL, uploaded asset path, or blob, return as-is
  if (
    path.startsWith('data:') || 
    path.startsWith('http://') || 
    path.startsWith('https://') || 
    path.startsWith('/uploads/') ||
    path.startsWith('blob:')
  ) {
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

  // 3. Strip leading paths to extract the base name (e.g. "...assets/images/cover_puzzles.jpg" -> "cover_puzzles.jpg")
  const cleanKey = path
    .replace(/^.*assets\/images\//, '')
    .trim();

  // Check registry for direct match or without file extension
  if (ASSET_REGISTRY[cleanKey]) {
    return ASSET_REGISTRY[cleanKey];
  }
  const keyWithoutExt = cleanKey.replace(/\.[^/.]+$/, '');
  if (ASSET_REGISTRY[keyWithoutExt]) {
    return ASSET_REGISTRY[keyWithoutExt];
  }

  // 4. Fallback defaults
  return coverToddlerPreschool;
}
