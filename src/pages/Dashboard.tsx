import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { SkillHeatmap } from '@/components/dashboard/SkillHeatmap';
import { CandidateCard } from '@/components/dashboard/CandidateCard';
import { EvaluationPanel } from '@/components/dashboard/EvaluationPanel';
import { seedCandidates } from '@/utils/seedData';
import {
  getCandidatesWithEvaluations,
  getTopRankings,
  evaluateCandidate,
  batchEvaluateCandidates
} from '@/db/api';
import type { CandidateWithEvaluation, Ranking } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [candidates, setCandidates] = useState<CandidateWithEvaluation[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [candidatesData, rankingsData] = await Promise.all([
        getCandidatesWithEvaluations(),
        getTopRankings(10)
      ]);
      setCandidates(candidatesData);
      setRankings(rankingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const result = await seedCandidates();
      if (result.success) {
        toast({
          title: 'Success',
          description: `Successfully created ${result.count} candidates`,
        });
        await loadData();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to seed candidates',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to seed candidates',
        variant: 'destructive'
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleEvaluateCandidate = async (candidate: CandidateWithEvaluation) => {
    setEvaluatingId(candidate.id);
    try {
      const result = await evaluateCandidate(candidate);
      if (result.success) {
        toast({
          title: 'Success',
          description: `${candidate.name} has been evaluated`,
        });
        await loadData();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to evaluate candidate',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to evaluate candidate',
        variant: 'destructive'
      });
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleBatchEvaluate = async () => {
    const unevaluated = candidates.filter(c => !c.evaluation);
    if (unevaluated.length === 0) return;

    try {
      toast({
        title: 'Evaluation Started',
        description: `Evaluating ${unevaluated.length} candidates...`,
      });

      const result = await batchEvaluateCandidates(unevaluated);
      
      toast({
        title: 'Evaluation Complete',
        description: `Successfully evaluated ${result.success} candidates. ${result.failed} failed.`,
      });

      await loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Batch evaluation failed',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <Skeleton className="h-12 w-64 bg-muted" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 bg-muted" />
            <Skeleton className="h-96 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidate Evaluation System</h1>
            <p className="text-muted-foreground mt-1">AI-powered candidate assessment and ranking</p>
          </div>
          <div className="flex gap-2">
            {candidates.length === 0 && (
              <Button onClick={handleSeedData} disabled={seeding} variant="default">
                <Database className="h-4 w-4 mr-2" />
                {seeding ? 'Seeding...' : 'Seed 40 Candidates'}
              </Button>
            )}
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Alert */}
        {candidates.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No candidates found. Click "Seed 40 Candidates" to generate sample data.
            </AlertDescription>
          </Alert>
        ) : rankings.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Candidates loaded. Start evaluating to see rankings and insights.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-secondary/10 border-secondary">
            <CheckCircle className="h-4 w-4 text-secondary" />
            <AlertDescription className="text-secondary-foreground">
              System active with {candidates.length} candidates and {rankings.length} evaluations.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {candidates.length > 0 && (
          <>
            {/* Evaluation Panel */}
            <EvaluationPanel
              candidates={candidates}
              onBatchEvaluate={handleBatchEvaluate}
            />

            {/* Leaderboard and Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Leaderboard rankings={rankings} />
              <SkillHeatmap rankings={rankings} />
            </div>

            {/* Candidates Grid */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Candidates ({candidates.length})</TabsTrigger>
                <TabsTrigger value="evaluated">
                  Evaluated ({candidates.filter(c => c.evaluation).length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({candidates.filter(c => !c.evaluation).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onEvaluate={handleEvaluateCandidate}
                      isEvaluating={evaluatingId === candidate.id}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="evaluated" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {candidates
                    .filter(c => c.evaluation)
                    .map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onEvaluate={handleEvaluateCandidate}
                        isEvaluating={evaluatingId === candidate.id}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {candidates
                    .filter(c => !c.evaluation)
                    .map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onEvaluate={handleEvaluateCandidate}
                        isEvaluating={evaluatingId === candidate.id}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
