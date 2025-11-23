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

**Secret 3: OpenAI API Key (Recommended - For Power BI Guru)**
- Name: `VITE_OPENAI_API_KEY`
- Value: Your OpenAI API key (starts with `sk-`)
- Where to get it:
  1. Go to https://platform.openai.com/api-keys
  2. Sign in or create an account
  3. Click "Create new secret key"
  4. Copy the key (starts with `sk-`)
  5. Paste the key value into the GitHub secret
- **Why this is recommended**: OpenAI is more reliable and works when Google/Gemini doesn't. The app will try OpenAI first, then fall back to Gemini if OpenAI fails.

**Secret 4: Google Gemini API Key (Alternative - For Power BI Guru)**
- Name: `VITE_GEMINI_API_KEY`
- Value: `YOUR_GOOGLE_GEMINI_API_KEY`
- Where to get it:
  1. Go to https://aistudio.google.com/app/apikey
  2. Create or select a project
  3. Generate a new API key (rotate if one was previously exposed)
  4. Paste the key value into the GitHub secret (and your local `.env` if needed)
- **Note**: This is optional if you have OpenAI key. The app will use Gemini as a fallback if OpenAI fails.

**⚠️ IMPORTANT: Configure HTTP Referrer Restrictions**

After creating your API key, you MUST configure HTTP referrer restrictions:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API key to edit it
3. Under "Application restrictions", select **"HTTP referrers (web sites)"**
4. Under "Website restrictions", add these patterns (one per line):
   - `*https://williamdalston.github.io/` (matches root with trailing slash)
   - `*https://williamdalston.github.io/*` (matches all paths)
   - `*https://williamdalston.github.io/hhs-analytics-command-center/*` (for your specific repo)
   - `*http://localhost:*` (for local development)
   - `*http://127.0.0.1:*` (for local development)
5. Click **"Save"**

**Note:** Google Cloud Console requires the asterisk (`*`) at the beginning for wildcard matching. The error shows the referrer as `https://williamdalston.github.io/` (with trailing slash), so make sure to include both the root path pattern and the wildcard path pattern.

**Optional: Limit which hosts may auto-use the built-in Gemini key**
- Name: `VITE_GEMINI_KEY_ALLOWED_HOSTS`
- Default: `localhost,127.0.0.1`
- Use case: Match this list to the referrer rules above so that public builds only attempt to call Gemini from approved domains. You can include bare hostnames (e.g., `analytics.hhs.gov`), ports (`localhost:4173`), or leading-dot patterns like `.hhs.gov` to cover subdomains. Use `*` to allow every host (not recommended).

After adding secrets, the GitHub Actions workflow will use them during the next build.
