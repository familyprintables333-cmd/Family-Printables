import { CategoryInfo } from '../types';
import { IMAGES } from '../assets/images';

/**
 * --------------------------------------------------------------------------
 * Category Catalog (Easy-to-Edit Configuration)
 * --------------------------------------------------------------------------
 * You can easily edit any category details below:
 * - title: Display name of the category
 * - shortDescription: Brief summary shown on cards
 * - image: Category cover image (Uses IMAGES.cover... or '/assets/images/...')
 * - targetAge: Recommended age group
 * - includedActivities: List of bulleted activities
 * --------------------------------------------------------------------------
 */

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'toddlers',
    title: 'Toddlers & Preschool',
    shortDescription: 'Pencil control, gentle curved tracing, bold alphabet strokes, color matching, and fine motor coordination.',
    fullDescription: 'Crafted specifically for early learners taking their first steps in handwriting and pencil control. Features extra-thick guide lines, friendly animal companions, and intuitive arrow directions to prevent frustration.',
    purpose: 'Early fine motor skill development, pencil grip control, and introductory hand-eye coordination.',
    targetAge: 'Ages 2-4 (Toddlers & Pre-K)',
    includedActivities: [
      'Curved & zigzag line-following pencil tracks',
      'Large format Alphabet (A-Z) & Numbers (1-10) stroke guides',
      'Animal color-matching & shape sorting practice',
      'Safe scissor-skill cutouts and beginner matching games'
    ],
    benefits: {
      forKids: 'Builds pencil confidence, prevents early frustration, and develops fine motor finger muscles through cheerful animal play.',
      forParents: 'Instant print-at-home worksheets that can be slipped into plastic sleeves for endless reusable dry-erase practice.'
    },
    image: IMAGES.coverToddler,
    badge: 'Ages 2-4',
    accentColor: 'from-pink-500 to-rose-500'
  },
  {
    id: 'early-learning',
    title: 'Early Learning & Kindergarten',
    shortDescription: 'Phonics letter sounds, sight words sentence builders, visual math counting, addition, and moral values.',
    fullDescription: 'Comprehensive academic readiness printables designed by early childhood educators to build confidence for kindergarten and first grade, turning learning into a joyful daily habit.',
    purpose: 'Academic foundation in early reading, phonetic awareness, visual mathematics, and positive character growth.',
    targetAge: 'Ages 4-6 (Pre-K to 1st Grade)',
    includedActivities: [
      'Phonics letter-sound associations & blending worksheets',
      'High-frequency Dolch sight words sentence builders',
      'Visual counting frames, object addition & subtraction',
      'Positive habits, good manners, and moral character stories'
    ],
    benefits: {
      forKids: 'Accelerates reading readiness, makes numbers intuitive with visual counters, and sparks classroom excitement.',
      forParents: 'Structured 15-minute daily practice sheets that ensure school readiness without screen fatigue.'
    },
    image: IMAGES.productKidsWorkbook,
    badge: 'Ages 4-6',
    accentColor: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'brain-teasers',
    title: 'Brain Teasers & Puzzles',
    shortDescription: 'Winding labyrinth mazes, vocabulary word searches, spot-the-difference, and logic challenges.',
    fullDescription: 'Engaging screen-free brain workouts designed to keep curious minds captivated. Tiered difficulty levels guide children to build sustained concentration, deduction, and patience.',
    purpose: 'Cognitive stimulation, spatial problem-solving, sustained focus, and screen-free entertainment.',
    targetAge: 'Ages 6-10 (Elementary & Tweens)',
    includedActivities: [
      'Graded thematic mazes (Space, Jungle, Ocean, Castle)',
      'Themed vocabulary word search puzzles with hidden words',
      'Spot-the-7-differences visual comparison illustrations',
      'Beginner Sudoku, crosswords, and logic riddles with complete answer keys'
    ],
    benefits: {
      forKids: 'Strengthens logical deduction, spatial reasoning, and mental endurance while solving exciting detective quests.',
      forParents: 'The ultimate screen-free boredom buster for road trips, flights, rainy weekends, and quiet afternoons.'
    },
    image: IMAGES.coverPuzzles,
    badge: 'Ages 6-10',
    accentColor: 'from-amber-500 to-orange-500'
  },
  {
    id: 'planning',
    title: 'Planning & Routines',
    shortDescription: 'Customizable chore boards, morning & bedtime checklists, star reward charts, and family meal kits.',
    fullDescription: 'Transform chaotic mornings and disorganized evenings into smooth family teamwork. Fillable PDF fields allow parents to easily type their children’s names and specific chores.',
    purpose: 'Household structure, self-regulation, time management, and positive habit reinforcement.',
    targetAge: 'Whole Family (Ages 4-14 & Parents)',
    includedActivities: [
      'Visual step-by-step morning & bedtime routine checklists',
      'Weekly chore boards with printable star reward tokens',
      'Family weekly dinner menu and healthy snack planner boards',
      'Habit trackers for reading, hydration, and screen-time moderation'
    ],
    benefits: {
      forKids: 'Fosters personal responsibility, pride of accomplishment, and predictable daily rhythm without feeling scolded.',
      forParents: 'Eliminates morning battles and bedtime friction by replacing repetitive nagging with clear visual boards.'
    },
    image: IMAGES.productRoutineBoard,
    badge: 'Whole Family',
    accentColor: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'seasonal',
    title: 'Festivals & Celebrations',
    shortDescription: 'High-resolution printable greeting cards and stationery suites for Eid, Ramadan, Christmas, Diwali, Holi, Mother\'s Day, Father\'s Day, and family celebrations.',
    fullDescription: 'Elegant, ready-to-print luxury greeting cards and celebration stationery suites designed for global holidays and cherished family milestones. Each bundle includes pre-formatted foldable card templates (5x7" and A6), matching gift tags, envelope liners, and heartfelt interior message prompts ready to print at home.',
    purpose: 'Personalized heartfelt greetings, elegant celebration stationery, holiday gifting, and cherished family traditions.',
    targetAge: 'Whole Family & All Ages (Adults, Teens & Kids)',
    includedActivities: [
      'Foldable 5x7" & A6 luxury Eid Mubarak & Ramadan Kareem greeting cards',
      'Foil-inspired Merry Christmas & Holiday celebration card suites with gift tags',
      'Vibrant Happy Diwali Diya & Happy Holi festive greeting cards',
      'Heartwarming Mother’s Day, Father’s Day & family milestone cards',
      'Matching printable envelope liners, decorative seals & heartfelt message inserts'
    ],
    benefits: {
      forKids: 'Enables children and families to write heartfelt personal notes and share warm festive wishes with loved ones across the globe.',
      forParents: 'Instant access to designer-grade luxury stationery that prints crisply on standard home cardstock without expensive store runs.'
    },
    image: IMAGES.festivalsCards,
    badge: 'Greeting Cards',
    accentColor: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'audio-stories',
    title: 'Stories & Bedtime',
    shortDescription: 'Illustrated picture eBooks paired with soothing 18-minute audio voiceovers and gentle lullaby music.',
    fullDescription: 'Created with pediatric bedtime rhythms in mind. Whimsical full-color storybook illustrations accompanied by crystal-clear, calming voiceover narrations designed to ease energetic children into peaceful sleep.',
    purpose: 'Bedtime relaxation, soothing evening anxiety, and gentle auditory imagination.',
    targetAge: 'Ages 2-8 (Toddlers & Young Readers)',
    includedActivities: [
      'High-resolution full-color illustrated bedtime picture eBooks',
      '18-Minute soothing MP3 audio narration with relaxing lullabies',
      'Tablet-friendly EPUB and PDF editions for iPad, Kindle, or phone',
      'Printable bedtime starlight coloring page for calming wind-down'
    ],
    benefits: {
      forKids: 'Dispels fear of the dark and gently guides active imaginations into sweet, comforting dreams.',
      forParents: 'A dependable wind-down ritual that eases bedtime struggles into a cozy, serene 15-minute bonding moment.'
    },
    image: IMAGES.productBedtime,
    badge: 'eBook + Audio',
    accentColor: 'from-purple-500 to-indigo-500'
  }
];
