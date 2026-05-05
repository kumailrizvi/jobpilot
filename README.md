# JobPilot AI MVP

AI job application assistant.

## What this MVP does

- Stores candidate profile
- Stores jobs
- Generates tailored resume
- Generates cover letter
- Generates application answers
- Tracks application status
- Keeps user approval before applying

## What it does not do yet

- It does not auto-spam applications.
- It does not bypass CAPTCHA, email verification, or platform rules.
- LinkedIn/Workday/Dayforce should be handled through a Chrome extension or user-assisted flow.

## Setup

```bash
npm install
cp .env.example .env
npx prisma db push
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Environment

Add your OpenAI key in `.env`.

## Suggested next build

1. Add auth with Clerk/Auth0
2. Add CV PDF parsing
3. Add browser extension
4. Add Greenhouse/Lever/Ashby connectors
5. Add encrypted credential vault
6. Add background worker queue


## New in this version

### Chrome extension

Located in `/extension`.

It autofills:
- Greenhouse
- Lever
- Ashby
- Workday
- Dayforce
- LinkedIn

It does not force-submit applications.

### Apply connectors

Located in `/lib/connectors`.

Current connectors:
- Greenhouse
- Lever
- generic routing for Ashby, Workday, Dayforce, LinkedIn

The MVP uses a safe user-assisted apply flow.
