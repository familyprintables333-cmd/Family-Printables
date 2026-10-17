import { Product } from '../types';
import { IMAGES } from '../assets/images';

/**
 * ============================================================================
 * FAMILY PRINTABLES & DIGITAL WORKBOOK STORE - PRODUCT CATALOG
 * ============================================================================
 * 
 * FLEXIBLE WORKBOOK LOCKING & PRICING:
 * - `isFree: true` -> 100% Free printable, instant download for everyone with no payment
 * - `isFree: false, isLocked: true` -> Locked / Paid, requires purchase or unlock
 * - Any workbook can be individually locked or unlocked in the Admin Portal!
 * ============================================================================
 */

export const INITIAL_PRODUCTS: Product[] = [
  // --------------------------------------------------------------------------
  // CATEGORY 1: TODDLERS & PRESCHOOL (AGES 2-4)
  // --------------------------------------------------------------------------
  {
    id: 'prod-toddler-free',
    title: 'Free Sample Pack: Pre-K Animal Tracing Lines & Big Shapes',
    category: 'toddlers',
    categoryLabel: 'Toddlers & Preschool',
    priceUSD: 0.00,
    isFree: true,
    isLocked: false,
    accessType: 'free',
    rating: 4.9,
    reviewsCount: 92,
    pages: 16,
    targetAge: 'Ages 2-4 (Toddlers & Pre-K)',
    educationalBenefit: 'Builds Early Pencil Grip, Curve Tracing & Finger Dexterity',
    includedItems: [
      '10 Dotted Line Tracing Activity Sheets',
      '4 Big Bold Animal Shape Matching Cards',
      '2 Scissor Skill Practice Sheets',
      'Instant Download US Letter & A4 PDFs'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', 'High-Res 300 DPI'],
    image: IMAGES.coverToddler,
    shortDesc: '100% Free starter workbook with gentle curved line tracing, cute animal paths, and basic circles & squares.',
    description: 'A completely free sample pack to introduce toddlers to joyful pen control and pencil coordination without pressure. Print as many times as you like!',
    features: [
      '16 High-contrast print-ready worksheets',
      'Extra-thick dotted guide lines for beginners',
      '100% Free - No checkout or credit card required',
      'Laminate-friendly for dry-erase reuse'
    ],
    samplePages: [
      {
        title: 'Page 01: Forest Friends Trail',
        subtitle: 'Guide the Squirrel to the Acorn',
        previewText: 'Trace the curved line gently with your favorite crayon.'
      },
      {
        title: 'Page 05: Big Happy Shapes',
        subtitle: 'Circle, Square & Triangle',
        previewText: 'Trace and color the circle like a warm sunny day.'
      }
    ],
    fileSize: '4.8 MB PDF',
    isBestseller: true
  },
  {
    id: 'prod-toddler-1',
    title: 'My First Preschool Activity Workbook: ABC, Tracing & Shapes (Master 52-Page Pack)',
    category: 'toddlers',
    categoryLabel: 'Toddlers & Preschool',
    priceUSD: 1.00,
    isFree: false,
    isLocked: true,
    accessType: 'paid',
    rating: 4.9,
    reviewsCount: 184,
    pages: 52,
    targetAge: 'Ages 2-4 (Toddlers & Pre-K)',
    educationalBenefit: 'Improves Fine Motor Skills, Pencil Grip & Hand-Eye Coordination',
    includedItems: [
      '30 Fun Dotted Line & Curved Tracing Worksheets',
      '14 Big Bold Alphabet (A-Z) & Numbers (1-10) Sheets',
      '8 Color Matching & Animal Scissor Practice Sheets',
      'Print-ready US Letter (8.5x11") & International A4 PDFs',
      'Reusable Dry-Erase Lamination Guide'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', 'High-Res 300 DPI'],
    image: IMAGES.coverToddler,
    shortDesc: 'Gentle dotted-line tracing, cute baby elephant & bunny illustrations, and vibrant coloring exercises.',
    description: 'Specifically crafted for 2-4 year old toddlers starting their early learning journey. Features extra-thick guide lines, friendly animal companions, and intuitive arrow directions to prevent toddler frustration. Print at home as many times as you like!',
    features: [
      '52 Clean, Print-Friendly Worksheets (B&W + Color accents)',
      'Large arrow guides designed for tiny hands',
      'Animal tracing and friendly recognition activities',
      'Laminate-friendly for endless whiteboard marker practice'
    ],
    samplePages: [
      {
        title: 'Page 04: Line Follower Trail',
        subtitle: 'Help Bunny Reach the Carrot',
        previewText: 'Trace along the wavy path from left to right without lifting your pencil.'
      },
      {
        title: 'Page 12: Big Letter A & Apple',
        subtitle: 'Uppercase A with directional strokes',
        previewText: '1. Slant down left. 2. Slant down right. 3. Bridge across the middle.'
      }
    ],
    fileSize: '12.4 MB PDF',
    isBestseller: true
  },

  // --------------------------------------------------------------------------
  // CATEGORY 2: EARLY LEARNING & PHONICS (AGES 4-7)
  // --------------------------------------------------------------------------
  {
    id: 'prod-early-free',
    title: 'Free Starter: Sight Words & Phonics Mini Flashcard Pack',
    category: 'early-learning',
    categoryLabel: 'Early Learning & Phonics',
    priceUSD: 0.00,
    isFree: true,
    isLocked: false,
    accessType: 'free',
    rating: 4.8,
    reviewsCount: 78,
    pages: 14,
    targetAge: 'Ages 4-6 (Pre-K to Kindergarten)',
    educationalBenefit: 'Early Phonics Sounds Recognition & Top 20 Sight Words',
    includedItems: [
      '20 Top Dolch Sight Words Cutout Flashcards',
      '8 Phonics Word Family Mini Worksheets (at, an, op, ig)',
      'Print-ready US Letter & A4 PDFs'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', '300 DPI Vector Print'],
    image: IMAGES.productKidsWorkbook,
    shortDesc: '100% Free printable phonics sound cards and visual kindergarten reading worksheets.',
    description: 'Jumpstart reading confidence with this free starter flashcard set. Perfect for morning warm-ups, homeschool reading corners, and classroom stations.',
    features: [
      '14 High-yield phonics worksheets & flashcards',
      'Clear bold fonts designed for emerging readers',
      '100% Free - Instant download',
      'Print on cardstock for durable study flashcards'
    ],
    fileSize: '5.2 MB PDF',
    isBestseller: false
  },
  {
    id: 'prod-early-1',
    title: 'Kindergarten Phonics, Math & Sight Words Master Workbook',
    category: 'early-learning',
    categoryLabel: 'Early Learning & Phonics',
    priceUSD: 2.00,
    isFree: false,
    isLocked: true,
    accessType: 'paid',
    rating: 4.9,
    reviewsCount: 246,
    pages: 68,
    targetAge: 'Ages 4-7 (Pre-K to 1st Grade)',
    educationalBenefit: 'Accelerates Reading Readiness, Phonics Mastery & Mental Math Basics',
    includedItems: [
      '26 Letter Sound & Phonics Association Sheets (A-Z)',
      '20 Top Dolch Sight Words Sentence Builders',
      '14 Visual Addition & Subtraction Counting Sheets',
      '8 Moral & Good Deeds Activity Sheets',
      'Certificate of Early Learning Achievement'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', '300 DPI Vector Print'],
    image: IMAGES.productKidsWorkbook,
    shortDesc: 'Complete phonics sounds, sight words sentence builders, visual math counting, and moral character stories.',
    description: 'Designed by certified early childhood educators to build kindergarten confidence. Includes cheerful illustrated sight words, single-digit math problems with visual counting blocks, and moral values lessons.',
    features: [
      '68 Structured Educational Pages',
      'Step-by-step reading progression from single letters to 3-word sentences',
      'Hands-on counting exercises using fruit and star illustrations',
      'Positive habit reinforcement worksheets'
    ],
    fileSize: '16.8 MB PDF',
    isBestseller: true
  },

  // --------------------------------------------------------------------------
  // CATEGORY 3: BRAIN PUZZLES & STEM MAZES (AGES 5-10)
  // --------------------------------------------------------------------------
  {
    id: 'prod-puzzles-free',
    title: 'Free Starter Pack: Detective Owl 20 Mini Mazes & Word Searches',
    category: 'puzzles',
    categoryLabel: 'Brain Puzzles & STEM Mazes',
    priceUSD: 0.00,
    isFree: true,
    isLocked: false,
    accessType: 'free',
    rating: 4.9,
    reviewsCount: 110,
    pages: 18,
    targetAge: 'Ages 5-10 (Kids & Tweens)',
    educationalBenefit: 'Spatial Navigation, Pattern Recognition & Screen-Free Focus',
    includedItems: [
      '10 Creative Animal & Space Mazes',
      '6 Themed Word Search Grids with Answer Keys',
      '2 Spot the 5 Differences Visual Puzzles',
      'Full Solution Key Included'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', 'Printable B&W Friendly'],
    image: IMAGES.coverPuzzles,
    shortDesc: '100% Free brain puzzle sampler with friendly labyrinth quests, animal word finds, and spot-the-differences.',
    description: 'Looking for quick screen-free entertainment for a road trip or quiet afternoon? This free puzzle sampler gives kids instant access to fun, stimulating logic games without cost.',
    features: [
      '18 High-quality black & white printer-friendly puzzle sheets',
      'Kid-friendly Detective Owl logic challenges',
      '100% Free instant printable download',
      'Includes answer keys on final sheets'
    ],
    fileSize: '6.4 MB PDF',
    isBestseller: true
  },
  {
    id: 'prod-puzzles-1',
    title: 'Brain Adventures! 100 Logic Mazes, Spot Difference & Sudoku Master Pack',
    category: 'puzzles',
    categoryLabel: 'Brain Puzzles & STEM Mazes',
    priceUSD: 2.00,
    isFree: false,
    isLocked: true,
    accessType: 'paid',
    rating: 4.8,
    reviewsCount: 132,
    pages: 44,
    targetAge: 'Ages 6-10 (Elementary & Tweens)',
    educationalBenefit: 'Strengthens Spatial Reasoning, Logical Focus, Patience & Problem-Solving',
    includedItems: [
      '18 Themed Mazes (Space, Ocean, Jungle & Castle Quests)',
      '14 Child-friendly Word Searches with Hidden Bonus Words',
      '8 Spot the 7 Differences Visual Challenges',
      '4 Beginner Sudoku & Crossword Grids',
      'Full Answer Keys at the back'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', 'Printable B&W Friendly'],
    image: IMAGES.coverPuzzles,
    shortDesc: 'Challenging labyrinth adventures, detective owl search games, and screen-free logic riddles.',
    description: 'The ultimate screen-free boredom buster for road trips, flights, and quiet family afternoons. Thoughtfully tiered from friendly beginner levels to engaging master challenges.',
    features: [
      '44 Engaging Puzzle Sheets with Detective Owl theme',
      'Graded difficulty curve from Easy to Medium-Hard',
      'Zero-screen entertainment that builds patience',
      'Complete solution pages included'
    ],
    fileSize: '11.2 MB PDF',
    isBestseller: false
  },
  {
    id: 'prod-puzzles-stem',
    title: 'Junior STEM Logic Grids & Secret Code Cracker Activity Book',
    category: 'puzzles',
    categoryLabel: 'Brain Puzzles & STEM Mazes',
    priceUSD: 1.50,
    isFree: false,
    isLocked: true,
    accessType: 'paid',
    rating: 4.9,
    reviewsCount: 88,
    pages: 36,
    targetAge: 'Ages 7-11 (Elementary STEM)',
    educationalBenefit: 'Deductive Reasoning, Binary Code Thinking & Algorithmic Problem Solving',
    includedItems: [
      '12 Logic Grid Deduction Matrix Puzzles',
      '10 Secret Cipher & Hieroglyphic Code Breakers',
      '8 Pixel Art Coordinate Graphing Challenges',
      'Complete Step-by-Step Solutions'
    ],
    format: ['US Letter PDF', 'A4 PDF', 'High-Res Vector Print'],
    image: IMAGES.coverPuzzles,
    shortDesc: 'Exciting spy cipher decoding, logic grids, and pixel math coordinates for curious thinkers.',
    description: 'Turn kids into secret agents of logic! Features graduated deduction grids, Morse code challenges, and pattern recognition problems that develop foundational mathematical thinking.',
    features: [
      '36 Engaging STEM deduction challenges',
      'Secret agent spy theme that captivates young minds',
      'Detailed answer matrix and tips for parents',
      'Print at home anytime'
    ],
    fileSize: '9.5 MB PDF',
    isBestseller: false
  },

  // --------------------------------------------------------------------------
  // CATEGORY 4: FAMILY ROUTINES & VISUAL TIMETABLES
  // --------------------------------------------------------------------------
  {
    id: 'prod-routines-free',
    title: 'Free Visual Morning & Bedtime Routine Mini Checklists',
    category: 'routines',
    categoryLabel: 'Family Routines & Planners',
    priceUSD: 0.00,
    isFree: true,
    isLocked: false,
    accessType: 'free',
    rating: 4.9,
    reviewsCount: 145,
    pages: 8,
    targetAge: 'All Ages (Toddler to Elementary)',
    educationalBenefit: 'Reduces Morning Rushing, Builds Independence & Calms Evening Meltdowns',
    includedItems: [
      'Morning Hero 5-Step Checklist Board',
      'Bedtime Calm 5-Step Checklist Board',
      'Visual Icon Cutouts for Customizing',
      'Print-ready US Letter & A4 PDFs'
    ],
    format: ['US Letter PDF', 'A4 PDF', 'Printable Color & B&W'],
    image: IMAGES.productRoutineBoard,
    shortDesc: '100% Free visual routine checklists for smooth mornings and restful bedtimes.',
    description: 'Empower your child to get ready without nagging! Slip these simple, visual 5-step checklists onto your fridge or bathroom mirror and watch morning power struggles vanish.',
    features: [
      '8 Visual, icon-guided routine checklist sheets',
      '100% Free instant download',
      'Slide into plastic sheet protector for dry-erase checkmarks',
      'Universal compatibility with home printers'
    ],
    fileSize: '3.6 MB PDF',
    isBestseller: true
  },
  {
    id: 'prod-planning-1',
    title: 'Ultimate Kids Weekly Routine, Chore Board & Meal Planner Kit (Complete System)',
    category: 'routines',
    categoryLabel: 'Family Routines & Planners',
    priceUSD: 1.00,
    isFree: false,
    isLocked: true,
    accessType: 'paid',
    rating: 5.0,
    reviewsCount: 312,
    pages: 24,
    targetAge: 'All Ages (Toddler to Teen & Family)',
    educationalBenefit: 'Builds Lifelong Responsibility, Self-Regulation, Timeliness & Family Teamwork',
    includedItems: [
      'Morning, Afternoon & Bedtime Routine Checklists',
      'Weekly Chore Chart with Star Reward Tokens',
      'Weekly Family Dinner & Snack Menu Planner',
      'Habit Tracker (Reading, Water & Screen-Time Limits)',
      'Fillable / Editable PDF version included'
    ],
    format: ['US Letter PDF', 'A4 PDF', 'Fillable Fields PDF'],
    image: IMAGES.productRoutineBoard,
    shortDesc: 'Morning routines, evening checklists, chore stars, and weekly family dinner planning templates.',
    description: 'Transform chaos into calm cooperation! This printable family organizational system gives kids visual ownership of their day with clear checklists and celebratory star rewards. Use as fillable PDF on computer or print and slide into dry-erase sleeves.',
    features: [
      'Fillable digital fields (type names & custom chores directly)',
      'Positive reinforcement star reward tracker',
      'Reusable with dry-erase marker when placed in 8.5x11 frame',
      'Includes blank template versions'
    ],
    fileSize: '9.8 MB PDF',
    isBestseller: true
  },

  // --------------------------------------------------------------------------
  // CATEGORY 5: HOLIDAYS, RAMADAN & SEASONAL PRINTABLES
  // --------------------------------------------------------------------------
  {
    id: 'prod-festivals-free',
    title: 'Free All-Seasons Festive Cards & Holiday Countdown Placemat',
    category: 'festivals',
    categoryLabel: 'Holidays & Seasonal Printables',
    priceUSD: 0.00,
    isFree: true,
    isLocked: false,
    accessType: 'free',
    rating: 4.9,
    reviewsCount: 164,
    pages: 12,
    targetAge: 'Whole Family & All Ages',
    educationalBenefit: 'Creative Holiday Expression, Gratitude Reflection & Family Tradition Building',
    includedItems: [
      '4 Foldable Holiday & Birthday Greeting Cards (5x7" & A6)',
      '2 Seasonal Countdown Calendar Placemats',
      'Holiday Gift Tags & Decorative Bunting Stencils',
      'Instant Download US Letter & A4 PDFs'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', '300 DPI Vector Print'],
    image: IMAGES.coverSeasonalHolidays,
    shortDesc: '100% Free printable all-season holiday greeting cards, autumn & winter placemats, and celebration gift tags.',
    description: 'Celebrate all seasons of the year! This complimentary festive craft pack includes foldable celebration cards, holiday countdowns, and colorful placemats to make every family holiday special.',
    features: [
      '12 Vibrant print-ready celebration sheets',
      'Year-round holiday coverage (Autumn, Winter, Spring, Eid, Birthdays)',
      '100% Free - Instant download without checkout',
      'Foldable greeting card lines and trim guides'
    ],
    fileSize: '7.8 MB PDF',
    isBestseller: true
  },
  {
    id: 'prod-festivals-bundle',
    title: 'Global Celebrations & All-Season Holiday Greeting Cards Complete Suite',
    category: 'festivals',
    categoryLabel: 'Holidays & Seasonal Printables',
    priceUSD: 2.50,
    isFree: false,
    isLocked: true,
    accessType: 'paid',
    rating: 5.0,
    reviewsCount: 142,
    pages: 56,
    targetAge: 'Whole Family & All Ages (Adults & Kids)',
    educationalBenefit: 'Celebrates Cultural Traditions, Global Festive Goodwill & Thoughtful Stationery Gifting',
    includedItems: [
      '14 All-Season Holiday Celebration Cards (Autumn, Winter, Spring, Birthdays)',
      '12 Foldable Eid Mubarak & Ramadan Kareem Greeting Cards (5x7" & A6)',
      '12 Elegant Christmas & New Year Holiday Cards',
      '10 Vibrant Diwali Diya & Global Celebration Greeting Cards',
      '8 Family Milestone & Gratitude Cards',
      'Coordinated Envelope Templates, Liners & Gift Tags (300 DPI)'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', '300 DPI High-Res Vector Print'],
    image: IMAGES.coverSeasonalHolidays,
    shortDesc: 'The ultimate year-round greeting card collection for all seasons, global festivals, and holidays.',
    description: 'An all-inclusive collection of luxury printable greeting cards designed for all of life’s most cherished holidays, global celebrations, and family milestones. Easily print on standard cardstock, trim along clean marks, and send heartfelt cards across the globe.',
    features: [
      '56 Designer-Grade Foldable Greeting Cards with Trim Lines',
      'Covers Year-Round Seasons, Eid, Ramadan, Christmas, Diwali, and Family Milestones',
      'Standard 5x7" and 4x6" foldable formats with envelope templates',
      'Includes both blank and pre-written heartwarming interior sentiments'
    ],
    fileSize: '18.2 MB PDF',
    isBestseller: true
  },
  {
    id: 'prod-seasonal-1',
    title: 'Eid Mubarak & Ramadan Kareem Luxury Printable Greeting Cards Suite',
    category: 'festivals',
    categoryLabel: 'Holidays & Seasonal Printables',
    priceUSD: 1.50,
    isFree: false,
    isLocked: true,
    accessType: 'paid',
    rating: 4.9,
    reviewsCount: 158,
    pages: 28,
    targetAge: 'Whole Family & All Ages (Adults & Kids)',
    educationalBenefit: 'Personalized Festive Greetings, Heartfelt Connection & Celebratory Giving',
    includedItems: [
      '16 Foldable Eid Mubarak & Ramadan Kareem Designer Greeting Cards',
      '12 Matching Festive Gift Tags, Bag Toppers & Decorative Seals',
      '8 Printable Envelope Liners with Islamic Arabesque & Gold Motifs',
      'Pre-written Heartfelt Sentiments & Blank Inside Message Cards',
      'High-Resolution Print-Ready US Letter & A4 PDFs (300 DPI)'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', '300 DPI High-Res Vector Print'],
    image: IMAGES.coverRamadan,
    shortDesc: 'Foldable Eid Mubarak and Ramadan Kareem greeting cards, festive gift tags, and decorative envelope liners.',
    description: 'Celebrate the blessed days of Ramadan and Eid with elegant printable greeting cards. Designed for easy folding on home cardstock with rich typography, gold geometric motifs, and heartwarming wishes for family, friends, and neighbors.',
    features: [
      '16 High-Resolution Foldable Greeting Card Designs',
      'Standard 5x7" (A7) and 4x6" (A6) Foldable Formats',
      'Includes trim guides and score lines for clean folding',
      'Print unlimited copies for family, colleagues, and friends'
    ],
    fileSize: '15.6 MB PDF',
    isBestseller: true
  }
];

export const PRODUCTS = INITIAL_PRODUCTS;

export const MOCK_ORDERS = [
  {
    id: 'FP-89214',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    country: 'United States',
    city: 'Austin, Texas',
    date: '10 mins ago',
    items: ['My First Preschool Activity Workbook'],
    totalUSD: 1.00,
    status: 'Instant Download Sent'
  },
  {
    id: 'FP-89211',
    customerName: 'Michael Chang',
    customerEmail: 'mchang@example.com',
    country: 'United States',
    city: 'San Jose, California',
    date: '35 mins ago',
    items: ['Kindergarten Phonics, Math & Sight Words Workbook'],
    totalUSD: 2.00,
    status: 'Instant Download Sent'
  },
  {
    id: 'FP-89208',
    customerName: 'Emma Watson-Reid',
    customerEmail: 'emma.reid@example.co.uk',
    country: 'United Kingdom',
    city: 'London',
    date: '1 hour ago',
    items: ['Ultimate Kids Weekly Routine, Chore Board & Meal Kit'],
    totalUSD: 1.00,
    status: 'Instant Download Sent'
  }
];
