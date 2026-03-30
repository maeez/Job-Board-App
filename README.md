# Job Board

A full-stack job board application built with Next.js. The platform connects job seekers with job posters through a smart matching system based on location, language requirements, and compensation expectations.

## Overview

The application supports two types of users. Job posters can create an account, post job listings, and review applicants. Job seekers can create an account, set up a profile, browse jobs matched to their profile, and apply to listings they are interested in.


## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS and shadcn/ui
- **Database:** PostgreSQL via Neon
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth
- **Data Fetching:** TanStack Query

## Project Structure

```
app/
  (auth)/           # Login and register pages
  poster/           # All poster pages and layouts
  seeker/           # All seeker pages and layouts
  api/              # API routes
lib/
  actions/          # Server actions for poster and seeker
  auth.ts           # Better Auth server configuration
  auth-client.ts    # Better Auth browser client
  db.ts             # Database connection
  schema.ts         # Database schema definitions
  session.ts        # Server session helper
components/
  ui/               # shadcn/ui components
  navbar.tsx        # Shared navigation bar
  logout-button.tsx # Client logout button
  providers.tsx     # TanStack Query provider
types/
  index.ts          # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm
- A Neon database account

### Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```env
DATABASE_URL=your_neon_connection_string
BETTER_AUTH_SECRET=your_random_secret_string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### Database Setup

Push the schema to your database:

```bash
pnpm db:push
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Other Database Commands

```bash
pnpm db:generate   # Generate migration files
pnpm db:migrate    # Run migrations
pnpm db:studio     # Open Drizzle Studio to view your database
```
