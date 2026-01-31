# Candidate Evaluation System - Quick Start Guide

## 🚀 What You've Got

A complete, production-ready AI-powered candidate evaluation system with:

✅ **40 Pre-Generated Candidates** - Realistic profiles using Faker.js  
✅ **AI Evaluation Engine** - Gemini 2.5 Flash integration via Edge Functions  
✅ **Interactive Dashboard** - Real-time rankings and visualizations  
✅ **Professional UI** - Modern design with shadcn/ui + Tailwind CSS  
✅ **Complete Documentation** - Setup guides, API docs, and schema  

## 📋 Quick Start (3 Steps)

### Step 1: Open the Application
The application is already deployed and running. Simply access it through your browser.

### Step 2: Seed Sample Data
1. Click the **"Seed 40 Candidates"** button on the dashboard
2. Wait for confirmation (takes ~2 seconds)
3. You'll see 40 candidates appear in the grid

### Step 3: Run AI Evaluations
**Option A - Batch Evaluation (Recommended)**
1. Look for the "AI Evaluation Control" panel
2. Click **"Evaluate X Candidates"** button
3. Wait 40-60 seconds for all evaluations to complete
4. Watch the leaderboard and heatmap populate automatically

**Option B - Individual Evaluation**
1. Find any candidate card without a score
2. Click **"Evaluate with AI"** button
3. Wait ~3 seconds for the evaluation
4. See the score appear on the card

## 🎯 Key Features to Explore

### 1. Leaderboard 🏆
- **Location**: Top left of dashboard
- **Shows**: Top 10 candidates ranked by overall score
- **Features**: Trophy badges, skill tags, experience years

### 2. Skill Heatmap 📊
- **Location**: Top right of dashboard
- **Shows**: Visual comparison of scores across three criteria
- **Features**: Color-coded bars, score legend, easy comparison

### 3. Candidate Cards 👤
- **Location**: Bottom grid (tabs: All/Evaluated/Pending)
- **Shows**: Individual profiles with detailed information
- **Features**: Skills, experience, evaluation breakdown

### 4. Evaluation Panel ⚡
- **Location**: Below header, above leaderboard
- **Shows**: Statistics and batch evaluation controls
- **Features**: Progress tracking, candidate counts

## 📊 Understanding the Scores

Each candidate is evaluated on three criteria (0-100 scale):

### Crisis Management 🚨
How well they handle high-pressure situations and emergencies

### Sustainability 🌱
Their knowledge of environmental practices and green initiatives

### Team Motivation 👥
Their ability to inspire and lead teams effectively

**Overall Score** = Average of all three criteria

### Score Ranges
- **90-100**: Exceptional ⭐⭐⭐⭐⭐
- **80-89**: Excellent ⭐⭐⭐⭐
- **70-79**: Good ⭐⭐⭐
- **60-69**: Adequate ⭐⭐
- **Below 60**: Needs Development ⭐

## 🔧 Technical Details

### Database Tables
- **candidates**: 40 profiles with skills and experience
- **evaluations**: AI-generated scores for each candidate
- **rankings**: Auto-calculated view of top performers

### AI Integration
- **Model**: Gemini 2.5 Flash
- **Method**: Edge Function (serverless)
- **Processing**: ~3 seconds per candidate
- **Batch**: 1-second delay between requests (rate limiting)

### Technology Stack
- React 18 + TypeScript
- Supabase (PostgreSQL + Edge Functions)
- shadcn/ui + Tailwind CSS
- Faker.js for data generation

## 📁 Documentation Files

All documentation is in the `docs/` folder:

1. **README.md** - Main documentation with setup instructions
2. **AI_PROMPTS.md** - Detailed AI evaluation criteria and prompts
3. **PROJECT_STRUCTURE.md** - Complete project architecture guide
4. **schema.sql** - Database schema with comments and sample queries

## 🎨 Design System

### Colors
- **Primary (Blue)**: Trust, professionalism - #4A90E2
- **Secondary (Green)**: Success, growth - #27AE60
- **Accent (Yellow)**: Attention, highlights - #F39C12

### Components
All UI components are from shadcn/ui library:
- Cards, Buttons, Badges
- Tabs, Progress bars
- Alerts, Skeletons
- And 50+ more...

## 🔄 Workflow Example

```
1. User opens dashboard
   ↓
2. Clicks "Seed 40 Candidates"
   ↓
3. 40 candidates appear in grid
   ↓
4. Clicks "Evaluate 40 Candidates"
   ↓
5. AI evaluates each candidate (40-60 seconds)
   ↓
6. Leaderboard shows top 10
   ↓
7. Heatmap displays score comparison
   ↓
8. Individual cards show detailed scores
```

## 💡 Tips & Tricks

### Refresh Data
Click the **"Refresh"** button in the header to reload all data from the database.

### Filter Candidates
Use the tabs to filter:
- **All**: See everyone
- **Evaluated**: Only scored candidates
- **Pending**: Candidates waiting for evaluation

### Individual Evaluation
If batch evaluation is too slow, evaluate candidates one at a time by clicking their individual "Evaluate with AI" buttons.

### Re-seed Data
If you want fresh candidates, you can delete all data and re-seed (requires database access).

## 🐛 Troubleshooting

### Issue: No candidates showing
**Solution**: Click "Seed 40 Candidates" button

### Issue: Evaluation taking too long
**Solution**: This is normal - 40 candidates take 40-60 seconds due to rate limiting

### Issue: Evaluation failed
**Solution**: Check browser console for errors, try individual evaluation instead of batch

### Issue: Scores not updating
**Solution**: Click the "Refresh" button to reload data

## 📞 Need Help?

Check these resources:
1. **README.md** - Comprehensive setup and usage guide
2. **AI_PROMPTS.md** - Understanding evaluation criteria
3. **PROJECT_STRUCTURE.md** - Technical architecture details
4. **Browser Console** - Error messages and logs

## 🎓 Learning Resources

### Understanding the Code
- **Frontend**: Check `src/pages/Dashboard.tsx` for main logic
- **Components**: Look in `src/components/dashboard/` for UI components
- **Database**: See `src/db/api.ts` for data operations
- **AI Logic**: Review `supabase/functions/evaluate-candidate/index.ts`

### Customization Ideas
- Add new evaluation criteria (e.g., technical skills, communication)
- Change scoring weights for different positions
- Add filtering and search functionality
- Export rankings to PDF or CSV
- Create detailed candidate profile pages

## 🎉 You're All Set!

The system is ready to use. Start by seeding candidates and running evaluations to see the AI in action!

---

**Built with ❤️ using React, Supabase, and AI**  
**Copyright 2026 Candidate Evaluation System**
