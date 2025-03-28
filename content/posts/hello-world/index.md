---
title: Test
summary: "lorem ipsum tes test test"
date: "2023-06-10T00:00:00Z"
tags: ["Blog", "Next.js"]
thumbnail: "https://res.cloudinary.com/dab33vdij/image/upload/v1743126300/IMG_0395_vrwb6o.jpg"
---

# Integrating shadcn/ui with Tanstack Table for server-side actions

The inspiration for this project came from the `Tasks` table component of `shadcn/ui`. It is built with `TanStack/react-table`, but it lacks server-side sorting, filtering, and pagination. This project aims to integrate `shadcn/ui` with `TanStack/react-table` to provide a robust table component with server-side actions. The project is bootstrapped with `create-t3-app`.

## Tech Stack

This project is built on a robust stack that includes:

- **Next.js** for the framework, providing server-side rendering and static site generation capabilities.
- **Tailwind CSS** for styling, offering a utility-first approach to design.
- **shadcn/ui** for UI components, ensuring a sleek and modern user interface.
- **TanStack/react-table** for the table package, enabling flexible and extensible tables.
- **Neon** for the database, offering scalable POSTGRESSQL-compatible databases.
- **Drizzle ORM** for object-relational mapping, simplifying database interactions.
- **Zod** for validation, ensuring data integrity through TypeScript-first schema definition.
- **million** for the optimizing compiler, enhancing performance and efficiency.

## Key Features

The integration of shadcn/ui with Tanstack Table boasts several advanced features:

- **Server-Side Actions**: Pagination, sorting, and filtering are handled server-side, reducing the load on the client and improving performance.
- **Customizable Columns**: Users can define columns as per their requirements, ensuring flexibility.
- **Dynamic Inputs**: Search and filters are debounced and faceted, respectively, enhancing the user experience by reducing lag and providing relevant filtering options.
- **Advanced Filtering**: An optional Notion-like filtering feature allows for complex query building.
- **Row selection Actions**: Selected rows can trigger actions such as deletion, with an optional floating bar for context-specific operations.
- **Reusability**: The reusable `useDataTable` hook can be used to quickly build tables with server-side actions.

## Getting Started

To run this project locally:

1. Clone the repository

   ```bash
   git clone https://github.com/sadmann7/shadcn-table
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Copy the `.env.example` to `.env` and update the variables.

   ```bash
   cp .env.example .env
   ```

4. Start the development server

   ```bash
   pnpm run dev
   ```

5. Push the database schema

   ```bash
   pnpm run db:push
   ```

## Codebase and Deployment

A comprehensive overview of the codebase is available on [YouTube](https://www.youtube.com/watch?v=BsvjF5Y6-C8&t=1s).

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify), and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Conclusion

I'm really grateful to Kavin Desi Valli for creating the dynamic filtering function for the table using `drizzle-orm`. Make sure to check out his [YouTube channel](https://www.youtube.com/@livecode247) for more amazing content on web development.
