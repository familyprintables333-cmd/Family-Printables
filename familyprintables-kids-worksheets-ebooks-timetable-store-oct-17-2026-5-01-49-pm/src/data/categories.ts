import { CategoryInfo } from '../types';
import { IMAGES } from '../assets/images';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'toddlers',
    title: 'Toddlers & Preschool (Ages 2-4)',
    shortTitle: 'Toddlers (2-4)',
    tagline: 'Gentle Tracing, Dotted Lines & Hand-Eye Coordination',
    description: 'Specially created for tiny fingers learning pencil grip, line following, basic shapes, numbers 1-10, and friendly alphabet tracing.',
    shortDescription: 'Gentle tracing, big bold alphabet & animal coloring for ages 2-4.',
    ageRange: 'Ages 2-4',
    accentColor: 'indigo',
    badge: 'Popular for Pre-K',
    itemCount: 12,
    image: IMAGES.coverToddler,
    features: [
      'Extra-thick tracing guidelines',
      'Cute animal characters & shape matching',
      'High contrast print-ready PDF formats',
      'Laminate-friendly for dry-erase reuse'
    ]
  },
  {
    id: 'early-learning',
    title: 'Early Learning & Phonics (Ages 4-7)',
    shortTitle: 'Kindergarten (4-7)',
    tagline: 'Sight Words, Phonics, Counting & Early Reading',
    description: 'Foundational kindergarten curriculum materials covering phonics blends, basic math word problems, sentence building, and creative coloring.',
    shortDescription: 'Sight words, foundational phonics, early math & sentence building.',
    ageRange: 'Ages 4-7',
    accentColor: 'violet',
    badge: 'Kindergarten Ready',
    itemCount: 16,
    image: IMAGES.productKidsWorkbook,
    features: [
      'CVC words & early phonics decoding',
      'Addition and subtraction visual counters',
      'Daily handwriting practice sheets',
      'Print-ready US Letter & A4 size'
    ]
  },
  {
    id: 'puzzles',
    title: 'Brain Puzzles & STEM Mazes (Ages 5-10)',
    shortTitle: 'Puzzles & STEM',
    tagline: 'Logic Grids, Crosswords, Mazes & Critical Thinking',
    description: 'Keep young brains sharp and screen-free with engaging logic puzzles, spot-the-difference, spatial reasoning, and word searches.',
    shortDescription: 'Screen-free logic puzzles, spot the difference, and brain teasers.',
    ageRange: 'Ages 5-10',
    accentColor: 'amber',
    badge: 'Screen-Free Fun',
    itemCount: 14,
    image: IMAGES.coverPuzzles,
    features: [
      'Graduated difficulty levels (Easy to Master)',
      'Spatial reasoning and dot-to-dot maps',
      'Answer key included on final pages',
      'Great for road trips & restaurants'
    ]
  },
  {
    id: 'routines',
    title: 'Family Routines & Visual Timetables',
    shortTitle: 'Routines & Planners',
    tagline: 'Morning, After-School & Bedtime Visual Schedules',
    description: 'Empower kids with independence through visual routine charts, chore tracking, reward tokens, and customizable family timetables.',
    shortDescription: 'Visual morning, bedtime & chore charts that build peaceful habits.',
    ageRange: 'All Ages (2-12)',
    accentColor: 'emerald',
    badge: 'Parent Favorite',
    itemCount: 8,
    image: IMAGES.productRoutineBoard,
    features: [
      'Visual icon-based checklist routine cards',
      'Interactive customizable schedules',
      'Reduces morning & bedtime power struggles',
      'Print & stick with Velcro or magnets'
    ]
  },
  {
    id: 'festivals',
    title: 'Printable Greeting Cards & Seasonal Celebrations',
    shortTitle: 'Greeting Cards & Holidays',
    tagline: 'All-Occasion Greeting Cards (Birthday, Mother’s Day, Father’s Day, Christmas, Eid), Calendars & Holiday Crafts',
    description: 'Elegant, luxury all-occasion printable greeting cards (Birthday, Mother’s Day, Father’s Day, Teacher’s Day, Christmas, Ramadan & Eid), plus holiday countdown charts and celebration crafts.',
    shortDescription: 'All-occasion printable cards (Birthday, Mother’s Day, Father’s Day, Christmas & Eid).',
    ageRange: 'All Ages & Families',
    accentColor: 'rose',
    badge: 'Cards & Celebrations',
    itemCount: 12,
    image: IMAGES.festivalsCards,
    features: [
      'All-occasion greeting cards: Birthday, Mother’s & Father’s Day, Christmas, Eid',
      'Foldable card layout with trim lines and matching envelope liners',
      'Celebration countdowns, deeds charts & holiday stationery',
      'Instant print-ready 300 DPI high-definition PDF files'
    ]
  }
];
