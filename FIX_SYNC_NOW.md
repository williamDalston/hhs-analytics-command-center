# 🚀 Quick Fix: Enable File Sync (2 Minutes)

## The Problem
Your file was uploaded in **Local Mode** (localStorage only), so it won't sync across devices.

## The Solution - Do These Steps:

### Step 1: Restart Dev Server ⚡
**This is the most important step!** Environment variables only load when the server starts.

```bash
# 1. Stop your current dev server (press Ctrl+C in the terminal)
# 2. Start it again:
npm run dev
```

### Step 2: Check Cloud Mode Status ✅
1. Open your app: `http://localhost:5173/#/portal`
2. Click the **"Files"** tab
3. Look for one of these badges at the top:
   - ✅ **"Cloud Mode - Files Sync"** (blue badge) = GOOD! Files will sync
   - ⚠️ **"Local Mode - No Sync"** (yellow badge) = BAD! Need to fix

### Step 3: Check Browser Console 🔍
1. Press **F12** to open developer tools
2. Go to **Console** tab
3. Look for:
   - ✅ `"✅ Supabase connected - Cloud Mode enabled"` = GOOD
   - ⚠️ `"⚠️ Supabase not configured"` = Check .env file

### Step 4: Re-upload Your File 📤
If you see "Cloud Mode" badge:
1. Delete the old file (if it's still there)
2. Upload your `.pbip` file again
3. You should see: **"uploaded successfully - Synced to cloud!"**

### Step 5: Check Other Computer 💻
On your other computer:
1. Refresh the page (F5)
2. Wait 3 seconds (auto-sync interval)
3. Or click the **"Refresh"** button in Files tab
4. Your file should appear! 🎉

---

## ✅ Quick Checklist

- [ ] Restarted dev server (`npm run dev`)
- [ ] See "Cloud Mode" badge in portal
- [ ] Console shows "Supabase connected"
- [ ] Re-uploaded file
- [ ] File appears on other computer

---

## 🔧 If Still Not Working

**If you still see "Local Mode" badge:**
1. Check `.env` file exists in project root
2. Verify it has these two lines:
   ```
   VITE_SUPABASE_URL=https://fqkkwxnixhonpvwlknco.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Make sure dev server is restarted
4. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

**If Cloud Mode works but file still doesn't sync:**
1. Check Supabase Dashboard → Storage → `portal-uploads` bucket exists
2. Check Supabase Dashboard → Table Editor → `portal_files` table exists
3. Run the SQL from `SETUP_SQL.sql` if tables don't exist

---

## 📞 Need Help?

Check `DEBUG_SYNC.md` for detailed troubleshooting!

