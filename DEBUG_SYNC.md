# 🔍 Debug File Sync Issue

## ✅ What's Configured
- ✅ Supabase URL: `https://fqkkwxnixhonpvwlknco.supabase.co`
- ✅ Supabase Key: Configured in `.env`

## 🔧 Steps to Fix Sync Issue

### 1. Restart Your Dev Server
**Important:** Environment variables are only loaded when the server starts!

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Check Browser Console
Open browser console (F12) and look for:
- ✅ `"✅ Supabase connected - Cloud Mode enabled"` = GOOD
- ⚠️ `"⚠️ Supabase not configured"` = BAD (env vars not loading)

### 3. Check Portal Status
In the Secure Portal (`/#/portal`), you should see:
- **"Cloud Mode - Files Sync"** badge = GOOD (files will sync)
- **"Local Mode - No Sync"** badge = BAD (files won't sync)

### 4. Verify Supabase Tables Exist
Your Supabase database needs these tables:
- `portal_files` - for file storage
- `portal_messages` - for messages

Check in Supabase Dashboard → Table Editor

### 5. Re-upload the File
If it was uploaded in Local Mode, you need to:
1. Delete the local file
2. Restart dev server (to enable Cloud Mode)
3. Upload again (should now sync)

### 6. Check Other Computer
On the other computer:
- Refresh the page (F5)
- Wait 3 seconds (auto-sync interval)
- Or click "Refresh" button in Files tab

## 🐛 Common Issues

**Issue:** File says "uploaded successfully" but not syncing
**Solution:** Check if you see "Cloud Mode" badge. If not, restart dev server.

**Issue:** "Local Mode" badge showing
**Solution:** 
1. Restart dev server
2. Check browser console for Supabase connection
3. Verify `.env` file has correct values

**Issue:** File appears on one computer but not other
**Solution:**
1. Make sure BOTH computers have Cloud Mode enabled
2. Wait 3 seconds for auto-sync
3. Click "Refresh" button manually

## ✅ Quick Test
1. Upload a test file
2. Check for "Cloud Mode" badge
3. Open on another computer
4. Should appear within 3 seconds!

