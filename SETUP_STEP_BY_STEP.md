# 🚀 Step-by-Step Supabase Setup Guide

Follow these steps in order. Each step takes about 1-2 minutes.

## Step 1: Create Supabase Account

1. Go to: **https://supabase.com**
2. Click **"Start your project"** button (top right)
3. Sign up with:
   - GitHub account (easiest) OR
   - Email and password
4. Verify your email if needed

**Time: ~2 minutes**

---

## Step 2: Create New Project

1. Once logged in, click **"New Project"** button
2. Fill in the form:
   - **Organization**: Select your org (or create one if first time)
   - **Project Name**: `hhs-secure-portal` (or any name you like)
   - **Database Password**: 
     - Choose a STRONG password (12+ characters)
     - **SAVE THIS PASSWORD** - you'll need it later!
     - Example: `MySecurePass123!@#`
   - **Region**: Choose closest to you (e.g., "US East" for US)
3. Click **"Create new project"**
4. Wait 1-2 minutes for project to finish setting up ⏳

**Time: ~3 minutes** (includes wait time)

---

## Step 3: Get Your API Keys

Once your project is ready (you'll see a success message):

1. In the left sidebar, click **"Settings"** (gear icon)
2. Click **"API"** under Project Settings
3. You'll see two important values:

   **Project URL:**
   - Looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this entire URL

   **anon public key:**
   - Very long string starting with `eyJ...`
   - Copy the entire key

**Save both of these - we'll use them in Step 5!**

**Time: ~1 minute**

---

## Step 4: Create Database Tables

1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"** button
3. Copy and paste this ENTIRE SQL script:

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

4. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
5. You should see: **"Success. No rows returned"** ✅

**Time: ~1 minute**

---

## Step 5: Add API Keys to Your Project

### Option A: For Local Development

1. In your project folder, create a file named `.env` (if it doesn't exist)
2. Add these two lines (replace with YOUR values):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

### Option B: For GitHub Pages Deployment

1. Go to your GitHub repository
2. Click **"Settings"** tab
3. Click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Add first secret:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://your-project-id.supabase.co` (your URL from Step 3)
   - Click **"Add secret"**
6. Click **"New repository secret"** again
7. Add second secret:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJ...` (your anon key from Step 3)
   - Click **"Add secret"**

**Time: ~2 minutes**

---

## Step 6: Update GitHub Actions Workflow (For Deployment)

If deploying to GitHub Pages, we need to make the secrets available during build:

1. Open `.github/workflows/deploy.yml`
2. Update the "Install and Build" step to include the secrets as environment variables

**Time: ~1 minute**

---

## Step 7: Test It!

1. Run `npm run dev` locally, or
2. Push to GitHub and wait for deployment
3. Navigate to the Secure Portal (`/#/portal`)
4. You should see **"Cloud Storage Enabled"** instead of "Local Storage Mode"
5. Upload a test file
6. Open the portal on a different computer/browser with the same token
7. The file should appear automatically! 🎉

---

## Troubleshooting

**Problem**: "Failed to load files. Using local storage."
- **Solution**: Check that your API keys are correct in `.env` or GitHub Secrets

**Problem**: "Error loading files from Supabase"
- **Solution**: Make sure you ran the SQL script in Step 4

**Problem**: Files not syncing
- **Solution**: Make sure both systems are using the exact same access token

---

## You're Done! ✅

The portal now:
- ✅ Stores files in the cloud (Supabase)
- ✅ Works across different computers/browsers
- ✅ Syncs automatically every 5 seconds
- ✅ All data is encrypted end-to-end
- ✅ Completely free!

Total setup time: **~10 minutes**

