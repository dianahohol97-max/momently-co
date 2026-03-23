# Momently Co

**Modular Digital Wedding Experience Platform**

Invitations · Website · RSVP · Guest Camera · Photo Booth · Memory Film

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/momently-co.git
cd momently-co
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration:
   - Open `supabase/migrations/001_initial_schema.sql`
   - Paste and execute the entire file
3. Go to Settings → API and copy your keys

### 3. Set Up Cloudflare R2

1. Create an R2 bucket called `momently-prod` at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Create an API token with R2 read/write permissions
3. Enable public access for the bucket (or use a custom domain)

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:
- Supabase URL + keys
- Cloudflare R2 credentials
- Stripe keys (get from [dashboard.stripe.com](https://dashboard.stripe.com))
- Resend API key (get from [resend.com](https://resend.com))

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy

Your site will be live at your Vercel URL. Connect your domain (momently.co) in Vercel settings.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── auth/           # OAuth callbacks
│   │   ├── weddings/       # Wedding CRUD
│   │   ├── templates/      # Template catalog
│   │   ├── guests/         # Guest management
│   │   ├── rsvp/           # Public RSVP endpoint
│   │   ├── uploads/        # R2 signed URLs
│   │   ├── blog/           # Blog posts API
│   │   └── payments/       # Monobank + Stripe webhooks
│   ├── dashboard/          # Protected user dashboard
│   ├── (marketing)/        # Public pages (blog, templates)
│   └── [slug]/             # Public wedding websites
├── components/             # React components
│   ├── ui/                 # Shared UI (buttons, inputs, modals)
│   ├── templates/          # Template rendering components
│   ├── admin/              # Admin panel components
│   ├── blog/               # Blog components
│   └── shared/             # Layout, navigation, footer
├── lib/                    # Core libraries
│   ├── supabase/           # Database clients
│   ├── storage/            # Cloudflare R2
│   ├── email/              # Resend email
│   ├── crm/                # CRM event tracking
│   ├── seo/                # Metadata + JSON-LD
│   └── utils/              # Helpers
├── types/                  # TypeScript definitions
├── config/                 # Template configs, locale strings
└── styles/                 # Global CSS
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (Google OAuth, magic link) |
| Storage | Cloudflare R2 |
| Payments | Monobank (UA) + Stripe (International) |
| Email | Resend |
| Hosting | Vercel |
| Analytics | PostHog |

## Database

28 tables covering:
- **Core**: users, weddings, templates, wedding_templates, guests
- **Modules**: save_the_dates, invitations, wedding_websites, rsvp_responses
- **Future**: guest_camera_uploads, photo_booth_sessions, guestbook_entries, memory_film_jobs
- **Admin**: admin_users, asset_library, activity_log
- **CRM**: crm_contacts, crm_events, crm_segments, email_campaigns, email_automations, email_templates
- **Blog**: blog_posts, blog_categories, blog_authors
- **pSEO**: pseo_cities, pseo_styles, seo_page_metrics

All tables have RLS policies, indexes, and auto-update triggers.

---

Built with 💍 by Diana
