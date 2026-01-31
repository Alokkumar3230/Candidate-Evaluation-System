-- Candidate Evaluation System Database Schema
-- PostgreSQL compatible schema for Supabase

-- ============================================
-- TABLES
-- ============================================

-- Candidates Table
-- Stores candidate profile information
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  experience_years INTEGER NOT NULL,
  skills TEXT[] NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations Table
-- Stores AI-generated evaluation scores for each candidate
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  crisis_management INTEGER NOT NULL CHECK (crisis_management >= 0 AND crisis_management <= 100),
  sustainability INTEGER NOT NULL CHECK (sustainability >= 0 AND sustainability <= 100),
  team_motivation INTEGER NOT NULL CHECK (team_motivation >= 0 AND team_motivation <= 100),
  overall_score DECIMAL(5,2) GENERATED ALWAYS AS ((crisis_management + sustainability + team_motivation) / 3.0) STORED,
  evaluation_notes TEXT,
  evaluated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id)
);

-- ============================================
-- VIEWS
-- ============================================

-- Rankings View
-- Provides ranked list of evaluated candidates
CREATE OR REPLACE VIEW rankings AS
SELECT 
  c.id,
  c.name,
  c.email,
  c.position,
  c.experience_years,
  c.skills,
  e.crisis_management,
  e.sustainability,
  e.team_motivation,
  e.overall_score,
  e.evaluated_at,
  RANK() OVER (ORDER BY e.overall_score DESC, e.evaluated_at ASC) as rank
FROM candidates c
LEFT JOIN evaluations e ON c.id = e.candidate_id
WHERE e.overall_score IS NOT NULL
ORDER BY e.overall_score DESC, e.evaluated_at ASC;

-- ============================================
-- INDEXES
-- ============================================

-- Performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_evaluations_candidate_id ON evaluations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_overall_score ON evaluations(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on tables
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Candidates policies
CREATE POLICY "Allow public read access to candidates"
  ON candidates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to candidates"
  ON candidates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Evaluations policies
CREATE POLICY "Allow public read access to evaluations"
  ON evaluations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to evaluations"
  ON evaluations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to evaluations"
  ON evaluations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- SAMPLE QUERIES
-- ============================================

-- Get all candidates with their evaluations
-- SELECT c.*, e.* 
-- FROM candidates c 
-- LEFT JOIN evaluations e ON c.id = e.candidate_id;

-- Get top 10 ranked candidates
-- SELECT * FROM rankings LIMIT 10;

-- Get unevaluated candidates
-- SELECT c.* 
-- FROM candidates c 
-- LEFT JOIN evaluations e ON c.id = e.candidate_id 
-- WHERE e.id IS NULL;

-- Get average scores by position
-- SELECT 
--   c.position,
--   AVG(e.crisis_management) as avg_crisis,
--   AVG(e.sustainability) as avg_sustainability,
--   AVG(e.team_motivation) as avg_motivation,
--   AVG(e.overall_score) as avg_overall
-- FROM candidates c
-- JOIN evaluations e ON c.id = e.candidate_id
-- GROUP BY c.position
-- ORDER BY avg_overall DESC;

-- ============================================
-- NOTES
-- ============================================

-- 1. The overall_score is automatically calculated as the average of the three criteria
-- 2. Each candidate can only have one evaluation (enforced by UNIQUE constraint)
-- 3. Deleting a candidate will cascade delete their evaluation
-- 4. The rankings view automatically updates when evaluations change
-- 5. RLS policies allow public access for demo purposes - adjust for production use
