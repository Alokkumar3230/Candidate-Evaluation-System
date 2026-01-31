import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import type { Ranking } from '@/types';

interface LeaderboardProps {
  rankings: Ranking[];
}

export function Leaderboard({ rankings }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-accent" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-secondary" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-secondary';
    if (score >= 60) return 'text-primary';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Top 10 Candidates
        </CardTitle>
        <CardDescription>Highest performing candidates based on AI evaluation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No evaluations yet. Start evaluating candidates to see rankings.</p>
          ) : (
            rankings.map((ranking) => (
              <div
                key={ranking.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(ranking.rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{ranking.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{ranking.position}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ranking.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {ranking.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ranking.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${getScoreColor(ranking.overall_score)}`}>
                    {ranking.overall_score.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">{ranking.experience_years} yrs exp</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
