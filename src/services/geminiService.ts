import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDE47qB81yV_1CS1ZyzfXkdu-vl_ahHsQw');

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  category: 'beginner' | 'intermediate' | 'expert';
  field: string;
  subfield: string;
  explanation?: string;
  tips?: string[];
}

export interface InterviewQuestionsResponse {
  beginner: InterviewQuestion[];
  intermediate: InterviewQuestion[];
  expert: InterviewQuestion[];
}

export class GeminiService {
  private static instance: GeminiService;
  private model: any;

  private constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async generateInterviewQuestions(
    field: string,
    subfield: string,
    customNotes?: string
  ): Promise<InterviewQuestionsResponse> {
    try {
      const prompt = this.buildPrompt(field, subfield, customNotes);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseGeminiResponse(text);
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw new Error('Failed to generate interview questions. Please try again.');
    }
  }

  private buildPrompt(field: string, subfield: string, customNotes?: string): string {
    const basePrompt = `Generate 24 interview questions for ${field} - ${subfield} position.
    
Requirements:
- 8 Beginner questions (basic concepts, fundamental knowledge)
- 8 Intermediate questions (practical experience, problem-solving)
- 8 Expert questions (advanced concepts, leadership, architecture)

${customNotes ? `Additional focus areas: ${customNotes}` : ''}

IMPORTANT: Keep answers SHORT and HUMAN-LIKE:
- Answers should be 2-3 sentences max, conversational tone
- Use "I would..." or "You should..." style responses
- Avoid overly technical jargon unless necessary
- Make explanations practical and actionable
- Tips should be brief, actionable advice

Format the response as a JSON object with this exact structure:
{
  "beginner": [
    {
      "id": "b1",
      "question": "Question text here",
      "answer": "Short, conversational answer (2-3 sentences max)",
      "category": "beginner",
      "field": "${field}",
      "subfield": "${subfield}",
      "explanation": "Brief, practical explanation (1-2 sentences)",
      "tips": ["Short actionable tip", "Another quick tip"]
    }
  ],
  "intermediate": [...],
  "expert": [...]
}

Make questions relevant and practical. Focus on real-world scenarios that interviewers actually ask.`;

    return basePrompt;
  }

  private parseGeminiResponse(response: string): InterviewQuestionsResponse {
    try {
      // Extract JSON from the response (sometimes Gemini includes markdown)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!parsed.beginner || !parsed.intermediate || !parsed.expert) {
        throw new Error('Invalid response structure from Gemini');
      }

      return {
        beginner: parsed.beginner.slice(0, 8),
        intermediate: parsed.intermediate.slice(0, 8),
        expert: parsed.expert.slice(0, 8)
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse questions. Please try again.');
    }
  }
}

export default GeminiService;
