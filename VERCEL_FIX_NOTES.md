# Vercel Prisma Fix

This version fixes the Vercel build error:

`@prisma/client did not initialize yet. Please run prisma generate`

Changes made:

- Added `postinstall: prisma generate`
- Added `build: prisma generate && next build`
- Added `vercel-build: prisma generate && next build`
- Added `vercel.json` to force Vercel build command
- Switched Prisma provider to `postgresql`
- Marked API routes as dynamic

Required Vercel env vars:

```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-project.vercel.app
```
