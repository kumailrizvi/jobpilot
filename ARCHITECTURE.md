# Architecture

## Frontend

- Next.js app router
- Dashboard
- Candidate profile
- Job creation
- Application review page

## Backend

- Next.js API routes
- Prisma ORM
- SQLite for local MVP
- Postgres for production
- OpenAI for generation

## Core flow

1. Candidate creates profile
2. Candidate adds job description
3. System creates draft application
4. AI generates tailored resume, cover letter, and answers
5. User reviews
6. User approves
7. Apply connector submits or routes to user-assisted flow

## Production services

- Web app: Vercel
- Database: Supabase Postgres
- File storage: Cloudflare R2/S3
- Queue: Redis/BullMQ
- Workers: Fly.io/Render
- Browser automation: Playwright workers
- Auth: Clerk/Auth0
- Payments: Stripe
- Secrets: Doppler/1Password/Cloud KMS

## Important compliance guardrails

- User must approve before submission
- No fake claims
- No credential storage without encryption
- Do not bypass CAPTCHA
- Respect platform terms
- Keep audit trail
