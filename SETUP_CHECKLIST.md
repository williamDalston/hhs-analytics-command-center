# ✅ Supabase Setup Checklist

Check off each step as you complete it:

## Phase 1: Supabase Account Setup
- [ ] Go to https://supabase.com
- [ ] Click "Start your project" and sign up
- [ ] Create new project
  - [ ] Project name: `hhs-secure-portal`
  - [ ] Set database password (SAVE IT!)
  - [ ] Choose region
  - [ ] Wait for project to finish (~2 min)

## Phase 2: Get API Keys
- [ ] Go to Settings → API
- [ ] Copy Project URL: `https://xxxxx.supabase.co`
- [ ] Copy anon public key: `eyJ...`
- [ ] Save both somewhere safe

## Phase 3: Create Database Tables
- [ ] Go to SQL Editor
- [ ] Click "New query"
- [ ] Paste the SQL script from SETUP_STEP_BY_STEP.md
- [ ] Click "Run"
- [ ] See "Success. No rows returned" ✅

## Phase 4: Configure Your Project

### For Local Development:
- [ ] Create `.env` file in project root
- [ ] Add `VITE_SUPABASE_URL=your-url`
- [ ] Add `VITE_SUPABASE_ANON_KEY=your-key`

### For GitHub Pages:
- [ ] Go to GitHub repo → Settings → Secrets → Actions
- [ ] Add secret: `VITE_SUPABASE_URL`
- [ ] Add secret: `VITE_SUPABASE_ANON_KEY`
- [ ] Push code (workflow will use secrets automatically)

## Phase 5: Test
- [ ] Run `npm run dev` OR wait for GitHub Pages deployment
- [ ] Go to `/#/portal`
- [ ] See "Cloud Storage Enabled" ✅
- [ ] Upload a test file
- [ ] Check on different computer - file appears! 🎉

## Done! 🎉

