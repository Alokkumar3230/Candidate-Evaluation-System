export interface Candidate {
  id: string;
  name: string;
  email: string;
  experience_years: number;
  skills: string[];
  position: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
  candidate_id: string;
  crisis_management: number;
  sustainability: number;
  team_motivation: number;
  overall_score: number;
  evaluation_notes?: string;
  evaluated_at: string;
}

export interface Ranking {
  id: string;
  name: string;
  email: string;
  position: string;
  experience_years: number;
  skills: string[];
  crisis_management: number;
  sustainability: number;
  team_motivation: number;
  overall_score: number;
  evaluated_at: string;
  rank: number;
}

export interface CandidateWithEvaluation extends Candidate {
  evaluation?: Evaluation;
}
