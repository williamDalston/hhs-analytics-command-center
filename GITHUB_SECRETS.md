# 🔐 Add GitHub Secrets for Deployment

**Before pushing**, add these secrets to GitHub:

1. Go to: https://github.com/williamDalston/hhs-analytics-command-center/settings/secrets/actions
2. Click **"New repository secret"**
3. Add these two secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://fqkkwxnixhonpvwlknco.supabase.co`

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`  
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2t3eG5peGhvbnB2d2xrbmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTkxMTAsImV4cCI6MjA3OTM3NTExMH0.8SUT_2anhTps9XVM7AEFTO55QvNbZVMOnzghWo5CmNI`

After adding secrets, the GitHub Actions workflow will use them during build.

