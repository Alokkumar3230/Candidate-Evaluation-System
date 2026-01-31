import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Briefcase, Calendar, Sparkles } from 'lucide-react';
import type { CandidateWithEvaluation } from '@/types';

interface CandidateCardProps {
  candidate: CandidateWithEvaluation;
  onEvaluate: (candidate: CandidateWithEvaluation) => void;
  isEvaluating?: boolean;
}

export function CandidateCard({ candidate, onEvaluate, isEvaluating = false }: CandidateCardProps) {
  const hasEvaluation = !!candidate.evaluation;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Briefcase className="h-3 w-3" />
              {candidate.position}
            </p>
          </div>
          {hasEvaluation && (
            <div className="text-right ml-2">
              <div className="text-2xl font-bold text-primary">
                {candidate.evaluation!.overall_score.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{candidate.email}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{candidate.experience_years} years experience</span>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Skills:</p>
          <div className="flex flex-wrap gap-1">
            {candidate.skills.map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {hasEvaluation && (
          <div className="pt-3 border-t space-y-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Crisis</p>
                <p className="font-semibold text-sm">{candidate.evaluation!.crisis_management}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sustain.</p>
                <p className="font-semibold text-sm">{candidate.evaluation!.sustainability}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team</p>
                <p className="font-semibold text-sm">{candidate.evaluation!.team_motivation}</p>
              </div>
            </div>
          </div>
        )}

        {!hasEvaluation && (
          <Button
            onClick={() => onEvaluate(candidate)}
            disabled={isEvaluating}
            className="w-full"
            variant="default"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isEvaluating ? 'Evaluating...' : 'Evaluate with AI'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
