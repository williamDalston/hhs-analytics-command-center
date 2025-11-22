# Supabase Setup Guide (Free & Easy)

## Step 1: Create Free Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"** → Sign up (free)
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: `hhs-secure-portal` (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"** (takes 1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 3: Create Database Tables

Go to **SQL Editor** in Supabase dashboard and run this SQL:

```sql
-- Create files table
CREATE TABLE portal_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  encrypted_data TEXT NOT NULL,
  iv TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by TEXT
);

-- Create messages table
CREATE TABLE portal_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL,
  message_text TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_files_token ON portal_files(token);
CREATE INDEX idx_messages_token ON portal_messages(token);

-- Enable Row Level Security (RLS)
ALTER TABLE portal_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;

-- Create policies to allow access with token
CREATE POLICY "Allow read with token" ON portal_files
  FOR SELECT USING (true);

CREATE POLICY "Allow insert with token" ON portal_files
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow delete with token" ON portal_files
  FOR DELETE USING (true);

CREATE POLICY "Allow read messages with token" ON portal_messages
  FOR SELECT USING (true);

CREATE POLICY "Allow insert messages with token" ON portal_messages
  FOR INSERT WITH CHECK (true);
```

## Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**OR** for GitHub Pages deployment, add these as secrets in your GitHub repository:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Then update `.github/workflows/deploy.yml` to include them as environment variables.

## Step 5: Done!

That's it! The portal will now:
- ✅ Store files in Supabase (encrypted)
- ✅ Work across different computers/browsers
- ✅ Real-time sync (updates every 5 seconds)
- ✅ Free tier: 500MB database, 1GB storage, 50K users/month

## Cost: $0/month (Free tier)

- 500MB database storage
- 1GB file storage
- 50,000 monthly active users
- Unlimited API requests
- Real-time subscriptions included

This is perfect for personal/internal use!

