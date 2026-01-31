# Project Structure

```
candidate-evaluation-system/
├── docs/
│   ├── AI_PROMPTS.md              # AI evaluation prompts documentation
│   ├── schema.sql                 # Database schema with comments
│   └── prd.md                     # Product requirements document
│
├── public/
│   ├── favicon.png
│   └── images/
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── CandidateCard.tsx       # Individual candidate display
│   │   │   ├── EvaluationPanel.tsx     # Batch evaluation controls
│   │   │   ├── Leaderboard.tsx         # Top 10 rankings
│   │   │   └── SkillHeatmap.tsx        # Score visualization
│   │   ├── ui/                         # shadcn/ui components
│   │   └── common/                     # Shared components
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx
│   │
│   ├── db/
│   │   ├── api.ts                      # Database operations
│   │   └── supabase.ts                 # Supabase client
│   │
│   ├── hooks/
│   │   ├── use-toast.tsx
│   │   ├── use-mobile.ts
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx               # Main application page
│   │   └── NotFound.tsx
│   │
│   ├── types/
│   │   ├── index.ts                    # Type exports
│   │   └── types.ts                    # Application types
│   │
│   ├── utils/
│   │   └── seedData.ts                 # Candidate data generation
│   │
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Application entry
│   ├── routes.tsx                      # Route configuration
│   └── index.css                       # Global styles & design tokens
│
├── supabase/
│   └── functions/
│       └── evaluate-candidate/
│           └── index.ts                # AI evaluation Edge Function
│
├── .env                                # Environment variables
├── package.json                        # Dependencies
├── tailwind.config.js                  # Tailwind configuration
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript configuration
├── README.md                           # Main documentation
└── TODO.md                             # Task tracking

```

## Key Files Description

### Frontend Components

**Dashboard.tsx**
- Main application page
- Orchestrates all dashboard components
- Handles data loading and state management
- Provides seed data and refresh functionality

**Leaderboard.tsx**
- Displays top 10 ranked candidates
- Shows rank badges (trophy, medal, award)
- Color-coded scores
- Responsive card layout

**SkillHeatmap.tsx**
- Visual representation of evaluation scores
- Horizontal bar charts for each criterion
- Color intensity based on score ranges
- Includes legend for score interpretation

**CandidateCard.tsx**
- Individual candidate profile display
- Shows skills, experience, and contact info
- Evaluation scores breakdown
- "Evaluate with AI" button for unevaluated candidates

**EvaluationPanel.tsx**
- Batch evaluation controls
- Progress tracking
- Statistics display (total, evaluated, pending)
- Batch evaluation trigger

### Database Layer

**api.ts**
- `getAllCandidates()` - Fetch all candidates
- `getCandidatesWithEvaluations()` - Fetch candidates with evaluation data
- `getTopRankings(limit)` - Get top N ranked candidates
- `evaluateCandidate(candidate)` - Trigger AI evaluation via Edge Function
- `batchEvaluateCandidates(candidates)` - Evaluate multiple candidates
- `bulkCreateCandidates(candidates)` - Insert multiple candidates

**supabase.ts**
- Supabase client initialization
- Environment variable configuration

### Data Generation

**seedData.ts**
- `generateCandidates(count)` - Generate fake candidate data
- `seedCandidates()` - Insert 40 candidates into database
- Uses Faker.js for realistic data
- 15 different positions with matching skill sets

### Types

**types.ts**
- `Candidate` - Candidate profile interface
- `Evaluation` - Evaluation scores interface
- `Ranking` - Ranked candidate interface
- `CandidateWithEvaluation` - Combined interface

### Edge Functions

**evaluate-candidate/index.ts**
- Receives candidate data
- Generates three evaluation prompts
- Calls AI API (Gemini 2.5 Flash)
- Parses SSE streaming responses
- Stores results in database
- Returns evaluation scores

### Configuration

**tailwind.config.js**
- Custom color tokens
- Professional blue/green/yellow palette
- Chart colors
- Animation configurations

**index.css**
- CSS custom properties
- Light and dark mode themes
- Design system tokens
- Global styles

## Data Flow

```
User Action (Dashboard)
    ↓
Component Event Handler
    ↓
API Function (api.ts)
    ↓
Supabase Client
    ↓
[Database OR Edge Function]
    ↓
Response
    ↓
State Update
    ↓
UI Re-render
```

## Evaluation Flow

```
1. User clicks "Evaluate with AI"
    ↓
2. evaluateCandidate() called
    ↓
3. Edge Function invoked with candidate data
    ↓
4. Edge Function generates 3 prompts
    ↓
5. AI API called for each criterion
    ↓
6. Scores parsed from SSE responses
    ↓
7. Results stored in evaluations table
    ↓
8. Response returned to client
    ↓
9. Dashboard refreshes data
    ↓
10. Leaderboard and heatmap update
```

## Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Serverless**: Supabase Edge Functions (Deno)
- **AI Model**: Gemini 2.5 Flash
- **Data Generation**: Faker.js
- **State Management**: React Hooks
- **Routing**: React Router v7
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## Development Workflow

1. **Setup**: Install dependencies with `pnpm install`
2. **Database**: Automatically configured via Supabase
3. **Development**: Use `pnpm run dev` (note: only lint is available)
4. **Validation**: Run `pnpm run lint` to check code
5. **Deployment**: Automatic via platform

## Best Practices

- **Type Safety**: All data structures typed with TypeScript
- **Error Handling**: Try-catch blocks with user-friendly messages
- **Loading States**: Skeleton loaders and loading indicators
- **Responsive Design**: Mobile-first approach with Tailwind
- **Code Organization**: Modular components and utilities
- **Database Queries**: Efficient with proper indexes
- **API Calls**: Rate limiting and error recovery
- **Security**: RLS policies on all tables

## Future Enhancements

- [ ] Add candidate filtering and search
- [ ] Export rankings to CSV/PDF
- [ ] Detailed candidate profile pages
- [ ] Historical evaluation tracking
- [ ] Custom evaluation criteria
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Candidate comparison tool
- [ ] Interview scheduling integration
