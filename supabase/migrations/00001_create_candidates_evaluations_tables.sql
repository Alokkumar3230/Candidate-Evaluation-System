-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  experience_years INTEGER NOT NULL,
  skills TEXT[] NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create evaluations table
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

-- Create rankings view
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

-- Enable RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (demo purposes)
CREATE POLICY "Allow public read access to candidates"
  ON candidates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to candidates"
  ON candidates FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_evaluations_candidate_id ON evaluations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_overall_score ON evaluations(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);