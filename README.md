# blog.jihyo.kim

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Content Management:** [content-collections](https://www.content-collections.dev)
- **DB:** [Neon](https://neon.com)
- **ORM:** [Drizzle](https://orm.drizzle.team)

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

## Author

MIT @ [Jihyo Kim](https://github.com/kimjihyo)

## Inspiration

This blog project is heavily inspired by the design and structure of [toss.tech](https://toss.tech).  
I truly admire their clean UX, typography, and attention to detail — and aimed to reflect that in my own way.
