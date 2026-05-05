# Deploy to Vercel

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "jobpilot ai mvp with extension and connectors"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## 2. Import on Vercel

Vercel → New Project → Import GitHub Repo.

## 3. Environment variables

```env
OPENAI_API_KEY=your_key
NEXTAUTH_SECRET=long_random_string
NEXTAUTH_URL=https://your-app.vercel.app
DATABASE_URL=your_postgres_url
```

## 4. Database

For Vercel production, use Postgres, not SQLite.

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then:

```bash
npx prisma db push
```

## 5. Build command

```bash
prisma generate && next build
```

## 6. Chrome extension

The extension is not deployed to Vercel. Install locally from the `/extension` folder during MVP testing.
Later, publish it to the Chrome Web Store.
