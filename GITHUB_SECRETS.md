# 🔐 Add GitHub Secrets for Deployment

**Before pushing**, add these secrets to GitHub to enable Cloud Storage and AI features:

1. Go to: https://github.com/williamDalston/hhs-analytics-command-center/settings/secrets/actions
2. Click **"New repository secret"**
3. Add these secrets:

**Secret 1: Supabase URL**
- Name: `VITE_SUPABASE_URL`
- Value: `https://fqkkwxnixhonpvwlknco.supabase.co`

**Secret 2: Supabase Key**
- Name: `VITE_SUPABASE_ANON_KEY`  
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxa2t3eG5peGhvbnB2d2xrbmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTkxMTAsImV4cCI6MjA3OTM3NTExMH0.8SUT_2anhTps9XVM7AEFTO55QvNbZVMOnzghWo5CmNI`

**Secret 3: Google Gemini API Key (For Power BI Guru)**
- Name: `VITE_GEMINI_API_KEY`
- Value: `AIzaSyDwiE6kUBveR6ncuUlphCbdK2EGqeLnMXY`

After adding secrets, the GitHub Actions workflow will use them during the next build.
