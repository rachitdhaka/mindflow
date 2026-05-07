-- Supabase Schema for MindFlow

-- Create Items Table
CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('idea', 'task')),
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) - Note: Since no auth is required per requirements, 
-- we allow all access for this personal productivity instance. 
-- In a real production app with multiple users, you would use auth.uid()
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all public operations" ON items
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable Realtime for items table
alter publication supabase_realtime add table items;

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the update_updated_at_column function before update
CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
