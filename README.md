# blog.jihyo.kim

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com) + [Flexoki](https://stephango.com/flexoki) color system
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Content:** MDX with remark/rehype plugin chain
- **DB:** [Neon](https://neon.com) PostgreSQL
- **ORM:** [Drizzle](https://orm.drizzle.team)
- **Deployment:** [Vercel](https://vercel.com)

## Running locally

1. Clone the repository

   ```bash
   git clone https://github.com/kimjihyo/blog.jihyo.kim.git
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory and add your database URL:

   ```bash
   echo "DATABASE_URL=your_neon_database_url" > .env
   ```

4. Sync the database schema with Neon

   ```bash
   pnpm db:push
   ```

5. Start the development server

   ```bash
   pnpm run dev
   ```

## Claude Code Skills

This project includes custom [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills located in `.claude/skills/`. These skills automate common development workflows specific to this blog.

### `/new-post` — Scaffold a new blog post

Creates a new MDX file in `/content` with pre-filled frontmatter.

```
/new-post
```

**What it does:**
- Asks for title, tags, and summary
- Shows existing tags from `.data/tags.json` for consistency
- Generates the MDX file with proper frontmatter (timestamps, slug, etc.)
- Runs `generate-posts-data.js` to update the content index

### `/review-post` — Review a blog post before publishing

Performs a comprehensive review of an MDX post.

```
/review-post
```

**What it checks:**
- **Frontmatter** — Required fields, valid formats, Cloudinary thumbnail URL
- **Content quality** — Spelling/grammar, broken markdown syntax, code blocks without language tags
- **Structure** — Heading hierarchy, intro/conclusion presence, paragraph length
- **SEO** — Title length, summary quality, tag count, image alt texts
- **Images** — Valid Cloudinary URLs, missing alt text, domain allowlist

### `/check-style` — Audit styling conventions

Checks that all styling code follows the project's design system rules.

```
/check-style
```

**Rules enforced:**
| Rule | Severity | Example violation |
|------|----------|-------------------|
| No arbitrary values | ERROR | `w-[200px]` — use design tokens instead |
| No px units | ERROR | `style={{ width: '200px' }}` |
| No hardcoded colors | ERROR | `text-red-500` — use semantic tokens (`text-primary`) |
| Use `cn()` for conditional classes | WARN | Template literal className instead of `cn()` |
| Dark mode coverage | WARN | Color without `dark:` variant or CSS variable |

### `/check-client-boundary` — Audit client component boundaries

Ensures the "Server Component First" principle is followed.

```
/check-client-boundary
```

**What it checks:**
- Compares `"use client"` files against the approved allowlist in `CLAUDE.md`
- Flags new client components and evaluates if they're justified
- Detects oversized client components that could be split
- Finds logic that could be moved to server components
- Checks for heavy dependencies imported in client bundles
- Auto-updates `CLAUDE.md` allowlist when new client components are approved

## Author

MIT @ [Jihyo Kim](https://github.com/kimjihyo)

## Inspiration

This blog project is heavily inspired by the design and structure of [toss.tech](https://toss.tech).
I truly admire their clean UX, typography, and attention to detail — and aimed to reflect that in my own way.
