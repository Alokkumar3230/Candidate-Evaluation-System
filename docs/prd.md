# Candidate Evaluation System Requirements Document

## 1. Application Overview

### 1.1 Application Name
Candidate Evaluation System

### 1.2 Application Description
A web-based candidate evaluation and ranking system that uses AI-powered assessments to evaluate candidates across multiple competencies and displays results through an interactive dashboard.

## 2. Core Features

### 2.1 Database Design
- MySQL-compatible database schema with the following tables:
  - **candidates table**: Store candidate information including ID, name, experience, and skills
  - **evaluations table**: Store AI-generated scores for crisis management, sustainability, and team motivation
  - **rankings table**: Auto-updated rankings based on evaluation scores
- SQL schema file with complete table definitions
- Sample dataset containing 40 candidate profiles

### 2.2 Random Candidate Generator
- Generate 40 realistic candidate profiles using Faker.js
- Include the following fields for each candidate:
  - Experience level
  - Skills list
  - Random attributes

### 2.3 AI Evaluation System
- Three evaluation prompts for assessing candidates:
  - Crisis management capabilities
  - Sustainability knowledge
  - Team motivation skills
- Integration with AI API for candidate evaluation

### 2.4 Dashboard Interface
- Built with React + Vite framework
- Mantine UI component library for interface elements
- Dashboard components:
  - **Leaderboard**: Display top 10 candidates
  - **Skill Heatmap**: Visualize evaluation scores across competencies
  - **Candidate Cards**: Show detailed candidate profiles

## 3. Deliverables

### 3.1 GitHub Repository Structure
- Frontend code (React + Vite)
- SQL schema and sample data files
- AI prompts documentation (Markdown/PDF format)
- README file with setup instructions

### 3.2 Documentation Requirements
- Complete setup instructions in README
- Database schema documentation
- AI prompt specifications