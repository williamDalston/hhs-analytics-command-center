-- Copy and paste this entire SQL script into Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query

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

