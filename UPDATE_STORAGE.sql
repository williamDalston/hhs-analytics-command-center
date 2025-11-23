-- Run this in Supabase SQL Editor to enable Large File Support

-- 1. Create the storage bucket for secure uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('portal-uploads', 'portal-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Storage Policies (Allowing public access because files are Encrypted)
-- Policy for uploading files
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'portal-uploads' );

-- Policy for downloading/reading files
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING ( bucket_id = 'portal-uploads' );

-- Policy for deleting files
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING ( bucket_id = 'portal-uploads' );

-- 3. (Optional) Update the files table to handle larger text if needed, 
-- but we will repurpose 'encrypted_data' to store the File Path.
-- No table changes required for the prototype refactor.



