-- Run this in Supabase SQL Editor to enable message deletion
-- Go to: Supabase Dashboard → SQL Editor → New Query

CREATE POLICY "Allow delete messages with token" ON portal_messages
  FOR DELETE USING (true);

