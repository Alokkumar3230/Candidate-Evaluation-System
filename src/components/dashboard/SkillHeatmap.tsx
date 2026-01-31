import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import type { Ranking } from '@/types';

interface SkillHeatmapProps {
  rankings: Ranking[];
}

export function SkillHeatmap({ rankings }: SkillHeatmapProps) {
  const getColorIntensity = (score: number) => {
    if (score >= 80) return 'bg-secondary';
    if (score >= 70) return 'bg-primary';
    if (score >= 60) return 'bg-accent';
    if (score >= 50) return 'bg-muted';
    return 'bg-muted/50';
  };

  const getTextColor = (score: number) => {
    if (score >= 60) return 'text-white';
    return 'text-foreground';
  };

  const topCandidates = rankings.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Skill Heatmap
        </CardTitle>
        <CardDescription>Competency scores across evaluation criteria</CardDescription>
      </CardHeader>
      <CardContent>
        {topCandidates.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No evaluation data available</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid grid-cols-[200px_1fr_1fr_1fr_100px] gap-2 mb-2 pb-2 border-b">
                <div className="font-semibold text-sm text-muted-foreground">Candidate</div>
                <div className="font-semibold text-sm text-muted-foreground text-center">Crisis Mgmt</div>
                <div className="font-semibold text-sm text-muted-foreground text-center">Sustainability</div>
                <div className="font-semibold text-sm text-muted-foreground text-center">Team Motivation</div>
                <div className="font-semibold text-sm text-muted-foreground text-center">Overall</div>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {topCandidates.map((candidate) => (
                  <div key={candidate.id} className="grid grid-cols-[200px_1fr_1fr_1fr_100px] gap-2 items-center">
                    <div className="truncate">
                      <p className="font-medium text-sm truncate">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-8 rounded overflow-hidden bg-muted/30">
                        <div
                          className={`h-full flex items-center justify-center font-semibold text-sm transition-all ${getColorIntensity(candidate.crisis_management)} ${getTextColor(candidate.crisis_management)}`}
                          style={{ width: `${candidate.crisis_management}%` }}
                        >
                          {candidate.crisis_management > 20 && candidate.crisis_management}
                        </div>
                      </div>
                      {candidate.crisis_management <= 20 && (
                        <span className="text-xs text-muted-foreground w-8">{candidate.crisis_management}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-8 rounded overflow-hidden bg-muted/30">
                        <div
                          className={`h-full flex items-center justify-center font-semibold text-sm transition-all ${getColorIntensity(candidate.sustainability)} ${getTextColor(candidate.sustainability)}`}
                          style={{ width: `${candidate.sustainability}%` }}
                        >
                          {candidate.sustainability > 20 && candidate.sustainability}
                        </div>
                      </div>
                      {candidate.sustainability <= 20 && (
                        <span className="text-xs text-muted-foreground w-8">{candidate.sustainability}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-8 rounded overflow-hidden bg-muted/30">
                        <div
                          className={`h-full flex items-center justify-center font-semibold text-sm transition-all ${getColorIntensity(candidate.team_motivation)} ${getTextColor(candidate.team_motivation)}`}
                          style={{ width: `${candidate.team_motivation}%` }}
                        >
                          {candidate.team_motivation > 20 && candidate.team_motivation}
                        </div>
                      </div>
                      {candidate.team_motivation <= 20 && (
                        <span className="text-xs text-muted-foreground w-8">{candidate.team_motivation}</span>
                      )}
                    </div>

                    <div className="text-center">
                      <span className="font-bold text-lg text-primary">
                        {candidate.overall_score.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Score Range:</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-secondary" />
                    <span className="text-xs">80-100</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary" />
                    <span className="text-xs">70-79</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-accent" />
                    <span className="text-xs">60-69</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-muted" />
                    <span className="text-xs">50-59</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-muted/50" />
                    <span className="text-xs">&lt;50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
