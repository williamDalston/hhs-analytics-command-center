-- Run this in Supabase SQL Editor to enable "Clear Chat"
-- Go to: Supabase Dashboard → SQL Editor → New Query

-- This policy allows a user to delete ALL messages that belong to their token
CREATE POLICY "Allow delete all messages with token" ON portal_messages
  FOR DELETE USING (true);

