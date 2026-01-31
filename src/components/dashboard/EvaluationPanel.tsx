import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CandidateWithEvaluation } from '@/types';

interface EvaluationPanelProps {
  candidates: CandidateWithEvaluation[];
  onBatchEvaluate: () => Promise<void>;
}

export function EvaluationPanel({ candidates, onBatchEvaluate }: EvaluationPanelProps) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progress, setProgress] = useState(0);

  const unevaluatedCount = candidates.filter(c => !c.evaluation).length;
  const evaluatedCount = candidates.filter(c => c.evaluation).length;
  const totalCount = candidates.length;
  const evaluationPercentage = totalCount > 0 ? (evaluatedCount / totalCount) * 100 : 0;

  const handleBatchEvaluate = async () => {
    setIsEvaluating(true);
    setProgress(0);

    try {
      await onBatchEvaluate();
    } finally {
      setIsEvaluating(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Evaluation Control
        </CardTitle>
        <CardDescription>Manage candidate evaluations using AI-powered assessments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total Candidates</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/10">
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold">{evaluatedCount}</p>
            <p className="text-xs text-muted-foreground">Evaluated</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-accent/10">
            <AlertCircle className="h-6 w-6 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">{unevaluatedCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Evaluation Progress</span>
            <span className="font-semibold">{evaluationPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={evaluationPercentage} className="h-2" />
        </div>

        {isEvaluating && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Evaluating candidates... This may take a few minutes.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleBatchEvaluate}
          disabled={isEvaluating || unevaluatedCount === 0}
          className="w-full"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isEvaluating
            ? 'Evaluating...'
            : unevaluatedCount === 0
              ? 'All Candidates Evaluated'
              : `Evaluate ${unevaluatedCount} Candidates`}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          AI evaluates candidates across crisis management, sustainability, and team motivation
        </p>
      </CardContent>
    </Card>
  );
}
