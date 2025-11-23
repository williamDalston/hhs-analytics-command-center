-- Run this in Supabase SQL Editor to enable the Project Tracker

-- 1. Create Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  stakeholder TEXT,
  deadline DATE,
  status TEXT DEFAULT 'Planning',
  priority TEXT DEFAULT 'Normal',
  requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Strategic Items Table (Decisions & Pain Points)
CREATE TABLE strategic_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'Decision' or 'Pain Point'
  title TEXT NOT NULL,
  date_logged DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Active', -- 'Active', 'Resolved', 'Mitigated'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategic_items ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Public access for this MVP - enables your app to Read/Write)
-- Policy for Projects
CREATE POLICY "Allow public access to projects" ON projects
FOR ALL USING (true) WITH CHECK (true);

-- Policy for Strategic Items
CREATE POLICY "Allow public access to strategic items" ON strategic_items
FOR ALL USING (true) WITH CHECK (true);

-- 5. Insert Sample Data (Optional - so it doesn't look empty initially)
INSERT INTO projects (name, stakeholder, deadline, status, priority, requirements)
VALUES 
('ASPA Analytics Dashboard', 'Lakshman / Venkata', '2023-12-01', 'In Progress', 'High', 'HHS branded theme. Metrics: Impressions, Engagements.'),
('Jira Delivery Dashboard', 'David Urer', '2023-12-15', 'Planning', 'Critical', 'Throughput and cycle time views.');

INSERT INTO strategic_items (type, title, date_logged, status, description)
VALUES
('Decision', 'Use HashRouter', '2023-11-22', 'Resolved', 'Switched to HashRouter for GitHub Pages compatibility.'),
('Pain Point', 'Jira API Access', '2023-11-20', 'Active', 'Waiting on IT approval for PAT token.');


