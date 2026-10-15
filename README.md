# Family Printables & Digital Workbooks Store

A modern, fast, and print-ready digital store and creator studio for children's workbooks, activity sheets, routine charts, bedtime audio stories, and printable planners.

---

## 📥 How to Download This Complete Project to Your Computer

You can download and run this updated project on your local system in a few simple steps:

### Option 1: AI Studio Direct Download (One-Click ZIP)
1. In the Google AI Studio Build interface, look at the top-right corner of the workspace.
2. Click the **Export** / **Download Code** button (or 3-dots menu → **Download as ZIP** / **Export to GitHub**).
3. Extract the downloaded ZIP file into a folder on your computer (e.g., `family-printables-store`).
4. Open your terminal / command prompt, navigate to that folder, and run:
   ```bash
   npm install
   npm run dev
   ```

### Option 2: Deploy Directly to Netlify
- **Direct GitHub Connection (Recommended):**
  1. Push this project to GitHub.
  2. In your Netlify dashboard, click **Add new site** → **Import an existing project** → GitHub.
  3. Netlify will automatically detect:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
  4. Click **Deploy**!
- **Manual Drag-and-Drop Deploy:**
  1. On your computer, run:
     ```bash
     npm run build
     ```
  2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
  3. Drag and drop the generated `dist` folder directly onto the page. Your site will go live immediately!

---

## 🌟 Key Updates & Improvements Implemented

1. **Flexible Custom Pricing:**
   - The fixed-price dropdown ($1, $2, $4) has been completely replaced with a flexible numeric input field (`$0.01` to any amount, with two decimal places).
   - You can enter any custom price (e.g., `$1.50`, `$3.00`, `$5.00`, `$12.99`, `$19.99`) when adding new workbooks or editing existing items in the Admin Panel.

2. **Fixed Netlify Image Paths & Universal Image Resolver:**
   - All product cover images are duplicated into both `src/assets/images/` and `public/assets/images/` with clean aliases (`cover_toddler.jpg`, `cover_puzzles.jpg`, `cover_ramadan.jpg`, etc.).
   - The universal `resolveImageUrl()` utility with automatic SVG fallback prevents blank white boxes from ever showing up on live Netlify deployments.
   - Includes `public/_redirects` and `netlify.toml` with `/* -> /index.html 200` single-page application routing rules.

3. **Removed "Restore Past Orders":**
   - The "Restore Past Orders by Email" form has been completely removed from the **My Downloads Vault**.
   - Preserves strictly the **90-Day (3-Month) Unlocked Download Access** for purchased items on the device with real-time countdown badges and 1-click renewal.

4. **Educational Blog / Information Section in Footer:**
   - Added an informative "Parent & Educator Learning Hub" directly in the website footer featuring articles on:
     - *The Science of Screen-Free Learning & Early Motor Development*
     - *Dry-Erase Lamination Hacks for Reusable Stations*
     - *Tear-Free Morning & Bedtime Routines with Visual Trackers*
     - *STEM Logic Mazes & Pattern Thinking in Early Childhood*
   - Includes an interactive reading modal for exploring full guides.

5. **Contact Us & 24/7 AI Auto-Response Support Desk:**
   - No real personal email address is exposed or required.
   - An interactive, smart AI-powered customer support widget provides instant, automated answers for printing questions (100% Actual Size scaling), lamination tips, 90-day vault policies, and iPad usage.

6. **Official USA Business Address:**
   - Displayed in the website footer and the AI Support dialog:
     ```
     Family Printables Publishing LLC
     123 Learning Way, Suite 400
     Dover, DE 19901, USA
     Operating Hours: Monday – Friday, 9:00 AM – 5:00 PM EST
     ```

7. **Complete Local Authentication & Account Persistence:**
   - Implemented `src/utils/authStorage.ts` with local storage backend persistence.
   - Supports user registration, password sign-in, guest sessions, and instant sync across browser refreshes.
   - Purchases and 90-day download access grants are stored securely.

8. **Stripe Payment Gateway Setup:**
   - Configured in `CheckoutModal.tsx` and `AdminPanelModal.tsx`.
   - Includes full Stripe Elements card inputs, SSL badges, test card helper, and admin inputs to store your live/test Stripe Publishable Key and Account ID.

---

## 📁 File Structure & Easy Self-Editing

All store contents, products, and images are organized so you can easily modify them yourself:

```
├── public/
│   ├── assets/images/     # Static images served directly on Netlify / live website
│   └── _redirects         # Netlify SPA redirect rules (ensures all URLs route to index.html)
├── src/
│   ├── assets/images/     # Original cover images & index.ts resolver
│   ├── data/
│   │   ├── products.ts    # ⭐ EDIT PRODUCTS, TITLES, PRICES & DESCRIPTIONS HERE
│   │   └── categories.ts  # ⭐ EDIT CATEGORY NAMES & DESCRIPTIONS HERE
│   ├── components/        # Store UI components
│   │   ├── AdminPanelModal.tsx    # Mobile admin & flexible pricing
│   │   ├── ContactSupportModal.tsx# 24/7 AI Support & USA address
│   │   ├── DownloadsDrawer.tsx    # 90-day vault (restore orders removed)
│   │   ├── Footer.tsx             # Blog hub, USA address, categories
│   │   ├── CheckoutModal.tsx      # Stripe card payment structure
│   │   └── UserAuthModal.tsx      # Local parent account sign-in/register
│   ├── utils/
│   │   ├── authStorage.ts # Local database & session storage
│   │   ├── access.ts      # 90-day temporary access timers
│   │   └── currency.ts    # Multi-currency conversions
│   ├── types/             # TypeScript definitions
│   └── App.tsx            # Main application layout
├── netlify.toml           # Netlify build configuration & asset caching headers
└── package.json
```

---

## ✏️ How to Edit Products and Prices

Open **`src/data/products.ts`**:
Each product is a clean JavaScript object:
```ts
{
  id: 'prod-toddler-1',
  title: 'My First Preschool Activity Workbook: ABC, Tracing & Shapes',
  category: 'toddlers',
  priceUSD: 1.50, // <-- Type ANY custom price you want ($1.50, $3.00, $5.00, $10.00, etc.)
  pages: 52,
  targetAge: 'Ages 2-4 (Toddlers & Pre-K)',
  image: IMAGES.coverToddler, // Or clean alias 'cover_toddler'
  shortDesc: 'Gentle dotted-line tracing...',
  // ...
}
```

---

## 🛠️ Verification & Build Commands

```bash
# Verify compilation
npm run build

# Start dev server on port 3000
npm run dev
```
