import { supabase } from './supabase';
import type { Candidate, Evaluation, Ranking, CandidateWithEvaluation } from '@/types';

// Candidates
export const getAllCandidates = async (): Promise<Candidate[]> => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getCandidateById = async (id: string): Promise<Candidate | null> => {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getCandidatesWithEvaluations = async (): Promise<CandidateWithEvaluation[]> => {
  const { data, error } = await supabase
    .from('candidates')
    .select(`
      *,
      evaluation:evaluations(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return Array.isArray(data) ? data.map(item => ({
    ...item,
    evaluation: Array.isArray(item.evaluation) ? item.evaluation[0] : item.evaluation
  })) : [];
};

export const createCandidate = async (candidate: Omit<Candidate, 'id' | 'created_at'>): Promise<Candidate> => {
  const { data, error } = await supabase
    .from('candidates')
    .insert(candidate)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const bulkCreateCandidates = async (candidates: Omit<Candidate, 'id' | 'created_at'>[]): Promise<Candidate[]> => {
  const { data, error } = await supabase
    .from('candidates')
    .insert(candidates)
    .select();

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Evaluations
export const getEvaluationByCandidateId = async (candidateId: string): Promise<Evaluation | null> => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('candidate_id', candidateId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getAllEvaluations = async (): Promise<Evaluation[]> => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .order('evaluated_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Rankings
export const getRankings = async (limit?: number): Promise<Ranking[]> => {
  let query = supabase
    .from('rankings')
    .select('*')
    .order('rank', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getTopRankings = async (limit = 10): Promise<Ranking[]> => {
  return getRankings(limit);
};

// Trigger AI evaluation via Edge Function
export const evaluateCandidate = async (candidate: Candidate): Promise<{ success: boolean; evaluation?: any; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('evaluate-candidate', {
      body: {
        candidateId: candidate.id,
        name: candidate.name,
        experienceYears: candidate.experience_years,
        skills: candidate.skills,
        position: candidate.position
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (err) {
    console.error('Evaluation error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// Batch evaluate multiple candidates
export const batchEvaluateCandidates = async (candidates: Candidate[]): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  for (const candidate of candidates) {
    try {
      const result = await evaluateCandidate(candidate);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      failed++;
    }
  }

  return { success, failed };
};
