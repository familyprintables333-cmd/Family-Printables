import { Product } from '../types';
import { IMAGES } from '../assets/images';

/**
 * ============================================================================
 * FAMILY PRINTABLES & DIGITAL WORKBOOK STORE - PRODUCT CATALOG
 * ============================================================================
 * 
 * EASY SELF-EDITING GUIDE:
 * - To change a product price: Edit `priceUSD: 1.00`
 * - To change a product title: Edit `title: "..."`
 * - To change a description: Edit `shortDesc: "..."` and `description: "..."`
 * - To change an image: Use `IMAGES.coverToddler`, `IMAGES.coverPuzzles`,
 *   or direct path `/assets/images/filename.jpg`
 * - To add a new product: Copy any product object and update its `id`
 * ============================================================================
 */

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-toddler-1',
    title: 'My First Preschool Activity Workbook: ABC, Tracing & Shapes',
    category: 'toddlers',
    categoryLabel: 'Toddlers & Preschool',
    priceUSD: 1.00,
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
      },
      {
        title: 'Page 28: Shape Sorting Circle & Square',
        subtitle: 'Match & Color the Shapes',
        previewText: 'Color circles yellow like the sun and squares blue like building blocks.'
      }
    ],
    fileSize: '12.4 MB PDF',
    isBestseller: true,
    reviews: [
      {
        id: 'rev-1',
        author: 'Emily Watson (California, US)',
        rating: 5,
        date: '3 days ago',
        comment: 'My 3-year-old daughter loves the elephant and bunny tracing pages! Printed on cardstock and she practices daily.',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        author: 'Zainab K. (London, UK)',
        rating: 5,
        date: '1 week ago',
        comment: 'For just $1, this is an incredible value. The file downloaded instantly without any hassle.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-early-1',
    title: 'Kindergarten Phonics, Math & Sight Words Workbook',
    category: 'early-learning',
    categoryLabel: 'Early Learning / Kindergarten',
    priceUSD: 2.00,
    rating: 4.9,
    reviewsCount: 246,
    pages: 68,
    targetAge: 'Ages 4-6 (Pre-K to 1st Grade)',
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
    shortDesc: 'Complete phonics sounds, sight words flashcards, object counting, and basic moral character stories.',
    description: 'Designed by certified early childhood educators to build kindergarten confidence. Includes cheerful illustrated sight words, single-digit math problems with visual counting blocks, and moral values lessons.',
    features: [
      '68 Structured Educational Pages',
      'Step-by-step reading progression from single letters to 3-word sentences',
      'Hands-on counting exercises using fruit and star illustrations',
      'Positive habit reinforcement worksheets'
    ],
    samplePages: [
      {
        title: 'Page 08: Phonics Sound "Ch"',
        subtitle: 'Choo-Choo Train & Cheese',
        previewText: 'Say "Ch". Color the items that start with the "Ch" sound.'
      },
      {
        title: 'Page 22: Sight Word Sentence',
        subtitle: 'Read, Trace & Write: "THE"',
        previewText: 'Trace the sight word: The cat sat on the mat.'
      },
      {
        title: 'Page 45: Apple Orchard Math',
        subtitle: 'Addition within 10 with visuals',
        previewText: 'Count 3 red apples + 2 green apples = 5 apples total.'
      }
    ],
    fileSize: '16.8 MB PDF',
    isBestseller: true,
    reviews: [
      {
        id: 'rev-3',
        author: 'David Reynolds (Toronto, Canada)',
        rating: 5,
        date: '5 days ago',
        comment: 'Top notch quality! Clear print margins on standard Letter paper. My 5-year-old enjoys it every afternoon.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-puzzles-1',
    title: 'Brain Adventures! Kids Mazes, Word Search & Logic Puzzles',
    category: 'brain-teasers',
    categoryLabel: 'Brain Teasers & Puzzles',
    priceUSD: 1.00,
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
    samplePages: [
      {
        title: 'Maze 07: Astronaut Cosmic Journey',
        subtitle: 'Find the Path to Planet Saturn',
        previewText: 'Navigate between asteroids without crossing any red laser lines.'
      },
      {
        title: 'Puzzle 16: Safari Word Hunt',
        subtitle: 'Find 8 Hidden Jungle Animals',
        previewText: 'Words can be found horizontally or vertically: LION, ZEBRA, GIRAFFE...'
      }
    ],
    fileSize: '11.2 MB PDF',
    isBestseller: false,
    reviews: [
      {
        id: 'rev-4',
        author: 'Rebecca Thorne (Austin, Texas)',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Printed the whole booklet for our 6-hour family road trip. Kept both kids quiet and excited without tablets!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-planning-1',
    title: 'Ultimate Kids Weekly Routine, Chore Board & Meal Planner Kit',
    category: 'planning',
    categoryLabel: 'Planning & Routines',
    priceUSD: 1.00,
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
    samplePages: [
      {
        title: 'Board 01: Morning Hero Routine',
        subtitle: 'From Wakeup to School Backpack Check',
        previewText: '1. Make bed. 2. Brush teeth. 3. Get dressed. 4. Healthy breakfast.'
      },
      {
        title: 'Board 03: Weekly Star Reward Board',
        subtitle: 'Reach 25 Stars for the Weekend Surprise',
        previewText: 'Earn 1 star per completed chore. Bonus stars for unprompted kindness.'
      }
    ],
    fileSize: '9.8 MB PDF',
    isBestseller: true,
    reviews: [
      {
        id: 'rev-5',
        author: 'Mark Sterling (Chicago, Illinois)',
        rating: 5,
        date: '4 days ago',
        comment: 'Framed this on our kitchen fridge with dry erase markers. Morning meltdowns have completely stopped. Best $1 ever spent!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-seasonal-1',
    title: 'Eid Mubarak & Ramadan Kareem Luxury Printable Greeting Cards Suite',
    category: 'seasonal',
    categoryLabel: 'Festivals & Celebrations',
    priceUSD: 1.00,
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
    samplePages: [
      {
        title: 'Card 01: Golden Arabesque Arch',
        subtitle: 'Eid Mubarak Crescent & Stars',
        previewText: 'May the divine blessings of Allah bring peace, joy, and prosperity to your home.'
      },
      {
        title: 'Card 05: Emerald Floral Gateway',
        subtitle: 'Ramadan Kareem Peace & Gratitude',
        previewText: 'Wishing you and your family a blessed, serene, and spiritually uplifting Ramadan.'
      }
    ],
    fileSize: '15.6 MB PDF',
    isBestseller: true,
    reviews: [
      {
        id: 'rev-6',
        author: 'Fatima Al-Mansoor (Dubai, UAE)',
        rating: 5,
        date: '1 week ago',
        comment: 'So lovely! My family was thrilled with the elegant card designs. Printed crisp and rich on linen cardstock.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-festivals-bundle',
    title: 'Global Festivals & Celebrations Printable Greeting Cards Complete Bundle',
    category: 'seasonal',
    categoryLabel: 'Festivals & Celebrations',
    priceUSD: 2.00,
    rating: 5.0,
    reviewsCount: 142,
    pages: 56,
    targetAge: 'Whole Family & All Ages (Adults & Kids)',
    educationalBenefit: 'Celebrates Cultural Traditions, Global Festive Goodwill & Thoughtful Stationery Gifting',
    includedItems: [
      '12 Foldable Eid Mubarak & Ramadan Kareem Greeting Cards (5x7" & A6)',
      '12 Elegant Merry Christmas & Winter Holiday Celebration Cards',
      '10 Vibrant Happy Diwali Diya & Happy Holi Festival Greeting Cards',
      '8 Heartwarming Mother\'s Day, Father\'s Day & Family Milestone Cards',
      'Matching Printable Envelope Templates, Liners & Coordinated Gift Tags',
      'Print-ready US Letter (8.5x11") & International A4 PDFs (300 DPI)'
    ],
    format: ['US Letter PDF (8.5x11")', 'A4 PDF', '300 DPI High-Res Vector Print'],
    image: IMAGES.festivalsCards,
    shortDesc: 'Designer printable greeting cards for Eid, Ramadan, Christmas, Diwali, Holi, Mother\'s Day, and Father\'s Day.',
    description: 'An all-inclusive collection of luxury printable greeting cards designed for all of life’s most cherished holidays and milestones. Easily print on standard cardstock, trim along clean marks, and send heartfelt cards across the globe.',
    features: [
      '42+ Designer-Grade Foldable Greeting Cards with Trim Lines',
      'Covers Eid, Ramadan, Christmas, Diwali, Holi, Mother\'s Day, and Father\'s Day',
      'Standard 5x7" and 4x6" foldable formats with envelope templates',
      'Includes both blank and pre-written heartwarming interior sentiments'
    ],
    samplePages: [
      {
        title: 'Festival Suite: Eid Mubarak & Ramadan',
        subtitle: 'Opulent Gold Foil & Arch Designs',
        previewText: 'May this blessed season illuminate your heart and bring boundless happiness.'
      },
      {
        title: 'Festival Suite: Merry Christmas & Winter',
        subtitle: 'Botanical Wreath & Gold Lettering',
        previewText: 'Wishing you peace, wonder, and joy this holiday season and in the new year ahead.'
      },
      {
        title: 'Festival Suite: Happy Diwali & Happy Holi',
        subtitle: 'Warm Diya Lights & Vibrant Splashes',
        previewText: 'May your days be filled with sparkling light, good health, and joyful colors.'
      }
    ],
    fileSize: '18.2 MB PDF',
    isBestseller: true,
    reviews: [
      {
        id: 'rev-8',
        author: 'Priya & Raj Sharma (London, UK)',
        rating: 5,
        date: '3 days ago',
        comment: 'Outstanding greeting card collection! We printed Diwali cards for family and Christmas cards for our neighbors. Outstanding quality!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-audio-1',
    title: 'Little Starlight Adventures: Calming Bedtime Story eBook & Audio',
    category: 'audio-stories',
    categoryLabel: 'Audio Stories & Bedtime',
    priceUSD: 2.00,
    rating: 5.0,
    reviewsCount: 198,
    pages: 36,
    targetAge: 'Ages 2-8 (Toddlers & Young Readers)',
    educationalBenefit: 'Reduces Bedtime Anxiety, Builds Imagination & Promotes Peaceful Sleep',
    includedItems: [
      '36-Page High Resolution Picture Storybook (US Letter & Tablet PDF)',
      '18-Minute Soothing Audio Narration MP3 with gentle music',
      'EPUB & PDF editions for iPad, Kindle, Tablet or Phone',
      'Printable Bedtime Starlight Coloring Page'
    ],
    format: ['Interactive PDF', 'EPUB', 'MP3 Audio (320kbps)'],
    image: IMAGES.productBedtime,
    shortDesc: 'Whimsical story of Barnaby Bear journeying across the starry night, with soothing audio narration.',
    description: 'An enchanting, gentle bedtime story crafted to help energetic little ones wind down into peaceful dreams. Follow Barnaby Bear as he says goodnight to the forest animals and listens to the gentle song of the Moon. Includes crystal-clear audio narration with gentle lullaby background chords.',
    features: [
      '36 Whimsical Full-Page Illustrated Spread Pages',
      '18-Minute Soothing Audio Narration (MP3 download)',
      'Optimized for reading on iPad, Kindle, or home print',
      'Gentle sleep transition techniques woven into story'
    ],
    samplePages: [
      {
        title: 'Spread 04: The Whisper of the Willows',
        subtitle: 'Barnaby Hears the Night Song',
        previewText: 'The stars began to blink like tiny fireflies, whispering: "Rest your little paws, little bear."'
      },
      {
        title: 'Spread 12: Goodnight to the Silver Moon',
        subtitle: 'A Blanket of Warmth',
        previewText: 'Close your eyes, take a deep gentle breath, and float away into sweet dreams.'
      }
    ],
    fileSize: '24.5 MB (PDF + MP3 Bundle)',
    isBestseller: true,
    reviews: [
      {
        id: 'rev-7',
        author: 'Amanda Clark (Seattle, Washington)',
        rating: 5,
        date: '6 days ago',
        comment: 'The audio narration is like magic for bedtime. My 4-year-old was asleep within 10 minutes. Beautiful artwork!',
        verifiedPurchase: true
      }
    ]
  }
];

export const ETSY_TAGS_MAP: Record<string, { title: string; tags: string[]; descSnippet: string }> = {
  'prod-toddler-1': {
    title: 'Toddler Tracing Worksheets PDF | Preschool Alphabet Activity Book | Pre-K Shapes & Scissor Skills | Instant Download US Letter & A4',
    tags: [
      'toddler tracing pdf',
      'preschool workbook',
      'pre k worksheets',
      'alphabet tracing',
      'busy binder toddler',
      'fine motor practice',
      'shapes and colors',
      'instant download pdf',
      'homeschool printables',
      'pencil control sheets',
      'us letter 8 5x11',
      'laminated activity',
      'easy tracing pages'
    ],
    descSnippet: '★ WHAT YOU WILL RECEIVE ★\n1. High-Resolution 52-Page PDF (US Letter 8.5" x 11")\n2. High-Resolution 52-Page PDF (International A4)\n3. Printing & Lamination Instructions\n\nInstant digital download right after purchase. No physical shipping.'
  },
  'prod-early-1': {
    title: 'Kindergarten Phonics Worksheets PDF | Alphabet Tracing Preschool Workbook | Sight Words & Early Math | Instant Download US Letter',
    tags: [
      'kindergarten worksheet',
      'alphabet tracing pdf',
      'preschool workbook',
      'phonics activities',
      'homeschool printables',
      'toddler learning binder',
      'handwriting practice',
      'sight words pages',
      'instant download pdf',
      'animal coloring sheet',
      'busy book printables',
      'us letter size 8 5x11',
      'pre k activity pack'
    ],
    descSnippet: '★ WHAT YOU WILL RECEIVE ★\n1. High-Resolution 68-Page PDF (US Letter 8.5" x 11")\n2. High-Resolution 68-Page PDF (International A4)\n3. Printing & Lamination Instructions Guide\n\nInstant digital download. Print unlimited times for personal and homeschool use!'
  },
  'prod-planning-1': {
    title: 'Customizable Family Chore Chart Printable | Weekly Kids Routine Board | Toddler Daily Checklist | Fillable PDF US Letter & A4',
    tags: [
      'family chore chart',
      'kids routine printable',
      'weekly chore board',
      'daily checklist child',
      'fillable pdf routine',
      'toddler visual schedule',
      'behavior reward chart',
      'homeschool timetable',
      'fridge chore planner',
      'positive reinforcement',
      'us letter instant download',
      'fillable chore tracker',
      'kids habit chart'
    ],
    descSnippet: '★ WHAT YOU WILL RECEIVE ★\n1. Fillable Editable PDF (Type names & tasks directly)\n2. High-Resolution Blank PDF (Print & write with dry-erase)\n3. Morning, Evening & Chore Token Guides\n\nInstant digital download right to your email.'
  },
  'prod-puzzles-1': {
    title: 'Kids Activity Book Mazes & Word Search PDF | Elementary Brain Teasers & Puzzles | Screen Free Travel Road Trip Boredom Buster',
    tags: [
      'kids maze book pdf',
      'word search printable',
      'brain teaser kids',
      'road trip activities',
      'screen free travel',
      'printable puzzle book',
      'logic puzzles children',
      'elementary homeschool',
      'spot the difference',
      'quiet time printable',
      'instant download pdf',
      'sudoku kids printable',
      'boredom buster binder'
    ],
    descSnippet: '★ WHAT YOU WILL RECEIVE ★\n1. 44-Page High Resolution Puzzle PDF (US Letter & A4)\n2. Complete Solutions & Answer Key Pages\n3. Ready to print at home on black and white laser or inkjet printers.'
  },
  'prod-seasonal-1': {
    title: 'Eid Mubarak & Ramadan Kareem Printable Greeting Cards | Foldable Luxury Holiday Stationery 5x7 and A6 | Islamic Gift Tags & Envelope Liners',
    tags: [
      'eid mubarak card pdf',
      'ramadan greeting printable',
      'islamic holiday cards',
      'printable eid cards',
      'foldable 5x7 card',
      'ramadan gift tags',
      'envelope liner template',
      'luxury stationery pdf',
      'instant download card',
      'eid celebration gift',
      'arabic pattern card',
      'print at home cardstock',
      'blessed eid stationery'
    ],
    descSnippet: '★ WHAT YOU WILL RECEIVE ★\n1. 16 Foldable Card Templates (5x7" & A6)\n2. 12 Matching Gift Tags & Bag Toppers\n3. 8 Elegant Envelope Liners with Islamic Arabesque Motifs\n4. Trim & fold guideline sheets'
  },
  'prod-festivals-bundle': {
    title: 'Global Festivals & Celebrations Printable Greeting Cards Bundle | Eid Ramadan Christmas Diwali Holi Mothers Day Cards | 5x7 & A6 Stationery Suite',
    tags: [
      'festival greeting cards',
      'printable holiday cards',
      'eid ramadan printable',
      'christmas card pdf',
      'diwali greeting cards',
      'mothers day card printable',
      'foldable stationery 5x7',
      'printable gift tags',
      'envelope liner pdf',
      'instant download card',
      'print at home cardstock',
      'holiday card bundle',
      'all occasion card set'
    ],
    descSnippet: '★ WHAT YOU WILL RECEIVE ★\n1. 42+ Foldable Greeting Cards (5x7" and A6)\n2. Comprehensive holiday coverage: Eid, Ramadan, Christmas, Diwali, Holi, Mother\'s Day, Father\'s Day\n3. Coordinated printable envelope templates, liners, and gift tags\n4. Instant high-resolution 300 DPI vector PDFs'
  },
  'prod-audio-1': {
    title: 'Kids Bedtime Story eBook & Audio Narration MP3 | Calming Illustrated Children Picture Book | Tablet iPad EPUB & Printable PDF',
    tags: [
      'kids bedtime story',
      'children audio book',
      'sleep story kids mp3',
      'bedtime story ebook',
      'illustrated kids book',
      'toddler bedtime rhyme',
      'ipad kids storybook',
      'kindle children epub',
      'sleep meditation kids',
      'starlight storybook',
      'instant download ebook',
      'audio story mp3',
      'printable storybook'
    ],
    descSnippet: '★ DIGITAL CHILDREN’S EBOOK & AUDIO ★\nEnjoy reading on any iPad, Kindle, smartphone, or print out at home! Formatted in 300 DPI with 18-minute gentle audio companion.'
  }
};

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
  },
  {
    id: 'FP-89195',
    customerName: 'Jessica Miller',
    customerEmail: 'jess.miller@example.com',
    country: 'United States',
    city: 'Orlando, Florida',
    date: '3 hours ago',
    items: ['Little Starlight Adventures: Calming Bedtime Story'],
    totalUSD: 2.00,
    status: 'Instant Download Sent'
  }
];
