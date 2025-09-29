const GEMINI_API_KEY = "AIzaSyDuyczDkBaH3KfCHfABOHhxVL1pscBOJFs";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface FeedbackResponse {
  feedback: string;
  scoreMessage: string;
}

// Few-shot prompting for consistent JSON output
const QUESTION_GENERATION_PROMPT = (topic: string) => `
Generate exactly 5 multiple choice questions about ${topic}. Return ONLY valid JSON in this exact format:

{
  "questions": [
    {
      "question": "What is the primary benefit of regular exercise for mental health?",
      "options": ["Improved sleep quality", "Better focus and concentration", "Reduced stress and anxiety", "All of the above"],
      "correctAnswer": 3,
      "explanation": "Regular exercise provides multiple mental health benefits including better sleep, improved focus, and reduced stress levels."
    }
  ]
}

Requirements:
- Each question must be clear and educational
- Provide exactly 4 options per question
- correctAnswer is the index (0-3) of the correct option
- Include a brief explanation for each answer
- Focus on practical, useful knowledge about ${topic}
- Make questions moderately challenging but fair

Generate 5 questions now:`;

const FEEDBACK_GENERATION_PROMPT = (score: number, total: number, topic: string) => `
Generate personalized feedback for a quiz score. Return ONLY valid JSON in this exact format:

{
  "feedback": "Great job! You demonstrated solid understanding of wellness concepts. Focus on reviewing nutrition guidelines to improve further.",
  "scoreMessage": "Excellent performance - you're well-informed about wellness practices!"
}

User scored ${score} out of ${total} on ${topic}. 
- If score >= 80%: Enthusiastic congratulations with specific strengths
- If score 60-79%: Encouraging with areas for improvement
- If score < 60%: Supportive with learning suggestions

Keep feedback positive, specific, and actionable. Generate feedback now:`;

export class AIService {
  private async makeAPICall(prompt: string, retries = 2): Promise<any> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No text content in response');
      }

      // Clean the response text and parse JSON
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('API call failed:', error);
      
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts remaining`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.makeAPICall(prompt, retries - 1);
      }
      
      throw error;
    }
  }

  async generateQuestions(topic: string): Promise<QuizData> {
    try {
      const prompt = QUESTION_GENERATION_PROMPT(topic);
      const response = await this.makeAPICall(prompt);
      
      // Validate response structure
      if (!response.questions || !Array.isArray(response.questions) || response.questions.length !== 5) {
        throw new Error('Invalid response format from AI');
      }

      // Validate each question
      response.questions.forEach((q: any, index: number) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
            typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

      return response as QuizData;
    } catch (error) {
      console.error('Failed to generate questions:', error);
      throw new Error('Failed to generate quiz questions. Please try again.');
    }
  }

  async generateFeedback(score: number, total: number, topic: string): Promise<FeedbackResponse> {
    try {
      const prompt = FEEDBACK_GENERATION_PROMPT(score, total, topic);
      const response = await this.makeAPICall(prompt);
      
      // Validate response structure
      if (!response.feedback || !response.scoreMessage) {
        throw new Error('Invalid feedback response format');
      }

      return response as FeedbackResponse;
    } catch (error) {
      console.error('Failed to generate feedback:', error);
      // Fallback feedback
      const percentage = Math.round((score / total) * 100);
      return {
        feedback: `You scored ${score} out of ${total} questions correctly (${percentage}%). Great effort on completing the ${topic} quiz!`,
        scoreMessage: percentage >= 80 ? "Excellent work!" : percentage >= 60 ? "Good job!" : "Keep learning!"
      };
    }
  }
}

export const aiService = new AIService();