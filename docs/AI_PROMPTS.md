# AI Evaluation Prompts Documentation

## Overview

This document describes the AI prompts used in the Candidate Evaluation System to assess candidates across three key competencies. Each prompt is designed to elicit a numerical score (0-100) from the AI model.

## Evaluation Criteria

### 1. Crisis Management

**Purpose**: Assess the candidate's ability to handle high-pressure situations, make quick decisions, and manage emergencies effectively.

**Prompt Template**:
```
Evaluate the crisis management capabilities of {name}, a {position} with {experienceYears} years of experience and skills in {skills}. Rate their ability to handle high-pressure situations, make quick decisions, and manage emergencies on a scale of 0-100. Respond with ONLY a number between 0 and 100.
```

**Evaluation Factors**:
- Experience level and years in the field
- Relevant skills (e.g., project management, leadership, technical expertise)
- Position responsibilities and typical challenges
- Decision-making capabilities
- Stress management potential

**Score Interpretation**:
- **90-100**: Exceptional crisis management skills, proven track record
- **80-89**: Strong capabilities, reliable under pressure
- **70-79**: Good skills, handles most situations well
- **60-69**: Adequate abilities, may need support in complex scenarios
- **50-59**: Basic skills, requires development
- **Below 50**: Limited crisis management experience

**Example**:
```
Input:
- Name: Sarah Johnson
- Position: DevOps Engineer
- Experience: 8 years
- Skills: Docker, Kubernetes, CI/CD, Linux, Terraform

Prompt:
"Evaluate the crisis management capabilities of Sarah Johnson, a DevOps Engineer with 8 years of experience and skills in Docker, Kubernetes, CI/CD, Linux, Terraform. Rate their ability to handle high-pressure situations, make quick decisions, and manage emergencies on a scale of 0-100. Respond with ONLY a number between 0 and 100."

Expected Output: 85
```

---

### 2. Sustainability

**Purpose**: Evaluate the candidate's knowledge of sustainable practices, environmental awareness, and commitment to green initiatives.

**Prompt Template**:
```
Evaluate the sustainability knowledge and environmental awareness of {name}, a {position} with {experienceYears} years of experience and skills in {skills}. Rate their understanding of sustainable practices, green initiatives, and environmental responsibility on a scale of 0-100. Respond with ONLY a number between 0 and 100.
```

**Evaluation Factors**:
- Industry relevance to sustainability
- Technical skills related to green technology
- Experience with sustainable practices
- Position's potential impact on environmental initiatives
- Knowledge of modern sustainability standards

**Score Interpretation**:
- **90-100**: Expert in sustainability, drives green initiatives
- **80-89**: Strong knowledge, actively implements sustainable practices
- **70-79**: Good understanding, supports sustainability efforts
- **60-69**: Basic awareness, willing to learn
- **50-59**: Limited knowledge, needs training
- **Below 50**: Minimal sustainability awareness

**Example**:
```
Input:
- Name: Michael Chen
- Position: Operations Manager
- Experience: 12 years
- Skills: Process Optimization, Supply Chain, Logistics, Lean Six Sigma, Project Management

Prompt:
"Evaluate the sustainability knowledge and environmental awareness of Michael Chen, an Operations Manager with 12 years of experience and skills in Process Optimization, Supply Chain, Logistics, Lean Six Sigma, Project Management. Rate their understanding of sustainable practices, green initiatives, and environmental responsibility on a scale of 0-100. Respond with ONLY a number between 0 and 100."

Expected Output: 78
```

---

### 3. Team Motivation

**Purpose**: Measure the candidate's ability to inspire, motivate, and lead teams effectively.

**Prompt Template**:
```
Evaluate the team motivation and leadership skills of {name}, a {position} with {experienceYears} years of experience and skills in {skills}. Rate their ability to inspire, motivate, and lead teams effectively on a scale of 0-100. Respond with ONLY a number between 0 and 100.
```

**Evaluation Factors**:
- Leadership experience and position level
- People management skills
- Communication and collaboration abilities
- Experience years (indicator of mentorship potential)
- Relevant soft skills in their skill set

**Score Interpretation**:
- **90-100**: Exceptional leader, highly motivational
- **80-89**: Strong leadership, inspires team members
- **70-79**: Good motivator, effective team player
- **60-69**: Adequate skills, developing leadership
- **50-59**: Basic abilities, needs leadership training
- **Below 50**: Limited team motivation experience

**Example**:
```
Input:
- Name: Emily Rodriguez
- Position: Product Manager
- Experience: 6 years
- Skills: Product Strategy, Agile, Roadmapping, User Research, Analytics

Prompt:
"Evaluate the team motivation and leadership skills of Emily Rodriguez, a Product Manager with 6 years of experience and skills in Product Strategy, Agile, Roadmapping, User Research, Analytics. Rate their ability to inspire, motivate, and lead teams effectively on a scale of 0-100. Respond with ONLY a number between 0 and 100."

Expected Output: 82
```

---

## Overall Score Calculation

The overall score is calculated as the arithmetic mean of all three criteria:

```
Overall Score = (Crisis Management + Sustainability + Team Motivation) / 3
```

**Example**:
- Crisis Management: 85
- Sustainability: 78
- Team Motivation: 82
- **Overall Score**: (85 + 78 + 82) / 3 = **81.67**

---

## AI Model Configuration

### Model Details
- **Model**: Gemini 2.5 Flash
- **API Endpoint**: `/v1beta/models/gemini-2.5-flash:streamGenerateContent`
- **Response Format**: Server-Sent Events (SSE)
- **Temperature**: Default (balanced creativity and consistency)

### Request Structure
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "[Evaluation Prompt]"
        }
      ]
    }
  ]
}
```

### Response Parsing
The system:
1. Receives SSE stream from AI API
2. Parses each data chunk for JSON content
3. Extracts text from `candidates[0].content.parts[0].text`
4. Uses regex to find numerical score
5. Validates score is between 0-100
6. Applies fallback scoring if parsing fails

### Fallback Scoring
If AI response cannot be parsed:
```javascript
score = Math.min(100, Math.max(40, 50 + experienceYears * 3 + Math.floor(Math.random() * 20)))
```

This ensures:
- Minimum score: 40
- Maximum score: 100
- Experience-based baseline: 50 + (years × 3)
- Random variation: 0-20 points

---

## Implementation Notes

### Prompt Design Principles
1. **Clarity**: Clear, specific instructions for the AI
2. **Constraint**: Explicit request for numerical output only
3. **Context**: Provides relevant candidate information
4. **Consistency**: Standardized format across all criteria
5. **Scalability**: Easy to add new evaluation criteria

### Best Practices
- Always include candidate context (name, position, experience, skills)
- Request only numerical output to simplify parsing
- Validate scores are within expected range (0-100)
- Implement fallback mechanisms for parsing failures
- Log evaluation results for audit and improvement

### Rate Limiting
- 1-second delay between batch evaluations
- Prevents API throttling
- Ensures stable system performance

### Error Handling
- Network failures: Retry with exponential backoff
- Parsing errors: Use fallback scoring algorithm
- API errors: Log and notify user
- Database errors: Rollback and report

---

## Future Enhancements

### Potential Additional Criteria
1. **Technical Proficiency**: Depth of technical skills
2. **Communication Skills**: Written and verbal abilities
3. **Innovation**: Creative problem-solving
4. **Adaptability**: Learning agility and flexibility
5. **Cultural Fit**: Alignment with organizational values

### Prompt Improvements
- Multi-turn conversations for deeper assessment
- Context-aware prompts based on industry
- Dynamic weighting of criteria by position
- Historical performance data integration

### AI Model Upgrades
- Fine-tuning on HR evaluation data
- Custom scoring models per industry
- Multi-model ensemble for consensus scoring
- Explainable AI for score justification

---

## Appendix: Sample Evaluations

### Example 1: Senior Software Engineer
**Candidate**: Alex Thompson, 10 years experience
**Skills**: JavaScript, React, Node.js, TypeScript, AWS

**Scores**:
- Crisis Management: 88 (Strong technical problem-solving)
- Sustainability: 72 (Moderate awareness of green tech)
- Team Motivation: 85 (Senior level, mentorship potential)
- **Overall**: 81.67

### Example 2: Junior Marketing Manager
**Candidate**: Jessica Lee, 3 years experience
**Skills**: Digital Marketing, SEO, Content Strategy, Social Media, Analytics

**Scores**:
- Crisis Management: 65 (Limited high-pressure experience)
- Sustainability: 70 (Good awareness of sustainable marketing)
- Team Motivation: 68 (Developing leadership skills)
- **Overall**: 67.67

### Example 3: VP of Operations
**Candidate**: Robert Martinez, 18 years experience
**Skills**: Process Optimization, Supply Chain, Logistics, Lean Six Sigma, Project Management

**Scores**:
- Crisis Management: 95 (Extensive crisis management experience)
- Sustainability: 88 (Deep knowledge of sustainable operations)
- Team Motivation: 93 (Proven leadership at executive level)
- **Overall**: 92.00

---

## Conclusion

This AI evaluation system provides objective, consistent candidate assessments across multiple competencies. The prompts are designed to leverage AI capabilities while maintaining reliability through structured output and fallback mechanisms.

For questions or improvements, please refer to the main README or contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-31  
**Author**: Candidate Evaluation System Team
