# Welcome to Your  Project


# Candidate Evaluation System

A web-based candidate evaluation and ranking system that uses AI-powered assessments to evaluate candidates across multiple competencies and displays results through an interactive dashboard.

## 🎯 Features

- **AI-Powered Evaluations**: Automated candidate assessment using advanced AI across three key competencies
- **Interactive Dashboard**: Real-time visualization of candidate rankings and performance metrics
- **Skill Heatmap**: Visual representation of evaluation scores across different criteria
- **Leaderboard**: Top 10 candidates ranked by overall performance
- **Batch Processing**: Evaluate multiple candidates simultaneously
- **Responsive Design**: Professional interface optimized for desktop and mobile devices

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI Integration**: Gemini 2.5 Flash API via Edge Functions
- **Data Generation**: Faker.js for realistic candidate profiles

### Database Schema

#### Candidates Table
```sql
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  experience_years INTEGER NOT NULL,
  skills TEXT[] NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Evaluations Table
```sql
CREATE TABLE evaluations (
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
```

#### Rankings View
```sql
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
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account (automatically configured)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd candidate-evaluation-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   The application automatically configures Supabase. Environment variables are set in `.env`:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. **Database Setup**
   The database schema is automatically created via migrations. Tables include:
   - `candidates`: Stores candidate information
   - `evaluations`: Stores AI-generated evaluation scores
   - `rankings`: View for ranked candidates

5. **Run the application**
   ```bash
   pnpm run dev
   ```

## 📊 Usage Guide

### 1. Seed Sample Data
- Click "Seed 40 Candidates" button on the dashboard
- Generates 40 realistic candidate profiles with diverse skills and experience levels
- Candidates are automatically inserted into the database

### 2. Evaluate Candidates
Two evaluation methods:

**Individual Evaluation:**
- Click "Evaluate with AI" on any candidate card
- AI evaluates the candidate across three criteria
- Results appear immediately on the dashboard

**Batch Evaluation:**
- Use the "Evaluation Control Panel"
- Click "Evaluate X Candidates" to process all pending evaluations
- Progress is tracked in real-time

### 3. View Results

**Leaderboard:**
- Displays top 10 candidates ranked by overall score
- Shows rank badges (🏆 Gold, 🥈 Silver, 🥉 Bronze)
- Includes key metrics: position, experience, skills

**Skill Heatmap:**
- Visual representation of scores across three competencies
- Color-coded bars indicate performance levels
- Easy comparison across candidates

**Candidate Cards:**
- Detailed view of each candidate
- Shows evaluation breakdown when available
- Quick access to individual evaluation

## 🤖 AI Evaluation Criteria

The system evaluates candidates across three key competencies:

### 1. Crisis Management (0-100)
Assesses ability to:
- Handle high-pressure situations
- Make quick, effective decisions
- Manage emergencies and unexpected challenges

### 2. Sustainability (0-100)
Evaluates knowledge of:
- Sustainable practices and green initiatives
- Environmental responsibility
- Long-term thinking and resource management

### 3. Team Motivation (0-100)
Measures capability to:
- Inspire and motivate team members
- Demonstrate leadership qualities
- Foster collaboration and engagement

**Overall Score**: Calculated as the average of all three criteria

## 🔧 Edge Function: evaluate-candidate

### Purpose
Handles AI-powered candidate evaluation using the Gemini 2.5 Flash API.

### Endpoint
```
POST /functions/v1/evaluate-candidate
```

### Request Body
```json
{
  "candidateId": "uuid",
  "name": "John Doe",
  "experienceYears": 5,
  "skills": ["JavaScript", "React", "Node.js"],
  "position": "Software Engineer"
}
```

### Response
```json
{
  "success": true,
  "evaluation": {
    "candidateId": "uuid",
    "crisisManagement": 85,
    "sustainability": 78,
    "teamMotivation": 92,
    "overallScore": "85.00"
  }
}
```

### Implementation Details
- Uses Server-Sent Events (SSE) for streaming AI responses
- Parses AI output to extract numerical scores
- Stores results directly in the database
- Handles errors gracefully with fallback scoring

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── Leaderboard.tsx          # Top 10 rankings display
│   │   ├── SkillHeatmap.tsx         # Visual score comparison
│   │   ├── CandidateCard.tsx        # Individual candidate view
│   │   └── EvaluationPanel.tsx      # Batch evaluation controls
│   └── ui/                          # shadcn/ui components
├── db/
│   ├── api.ts                       # Database operations
│   └── supabase.ts                  # Supabase client
├── pages/
│   └── Dashboard.tsx                # Main application page
├── types/
│   └── types.ts                     # TypeScript interfaces
├── utils/
│   └── seedData.ts                  # Candidate data generation
└── routes.tsx                       # Application routing

supabase/
└── functions/
    └── evaluate-candidate/
        └── index.ts                 # AI evaluation Edge Function
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#4A90E2) - Trust, professionalism
- **Secondary**: Green (#27AE60) - Success, growth
- **Accent**: Yellow (#F39C12) - Attention, highlights
- **Muted**: Gray tones for backgrounds and secondary text

### Components
- Built with shadcn/ui for consistency
- Tailwind CSS for responsive design
- Custom animations for smooth interactions

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for demo purposes
- Edge Functions use service role for database operations
- API keys secured via environment variables

## 📈 Performance Considerations

- Batch evaluation includes 1-second delay between requests to avoid rate limiting
- Database indexes on frequently queried columns
- Efficient SQL queries with proper joins
- Client-side caching of candidate data

## 🧪 Testing

Run linting and type checking:
```bash
pnpm run lint
```

## 📝 Sample Data

The system generates 40 candidates across 15 different positions:
- Software Engineer
- Product Manager
- Data Scientist
- UX Designer
- DevOps Engineer
- Marketing Manager
- Sales Director
- HR Manager
- Financial Analyst
- Operations Manager
- Business Analyst
- Project Manager
- Quality Assurance Engineer
- Security Analyst
- Customer Success Manager

Each candidate includes:
- Realistic name and email
- 1-20 years of experience
- Position-specific skill sets
- Unique profile attributes

## 🤝 Contributing

This is a demonstration project showcasing AI-powered evaluation systems. Feel free to fork and adapt for your needs.

## 📄 License

Copyright 2026 Candidate Evaluation System

## 🆘 Troubleshooting

### Issue: Candidates not loading
- Check Supabase connection in browser console
- Verify environment variables are set correctly
- Ensure database migrations ran successfully

### Issue: AI evaluation fails
- Check Edge Function logs in Supabase dashboard
- Verify API key is configured
- Ensure network connectivity to AI API endpoint

### Issue: Slow batch evaluation
- This is expected behavior (1 second delay per candidate)
- Evaluating 40 candidates takes approximately 40-60 seconds
- Consider evaluating in smaller batches

## 📞 Support

For issues or questions, please check:
1. Browser console for error messages
2. Supabase dashboard for Edge Function logs
3. Database query logs for SQL errors

---

Built with ❤️ using React, Supabase, and AI
