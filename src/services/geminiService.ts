import { GoogleGenerativeAI } from '@google/generative-ai';

// Get Gemini API key from environment variable
// Check at runtime to ensure it's available
const getGeminiApiKey = (): string => {
  const key = process.env.REACT_APP_GEMINI_API_KEY || '';
  return key;
};

const GEMINI_API_KEY = getGeminiApiKey();

// Log API key status (without exposing the key)
if (!GEMINI_API_KEY) {
  console.warn('⚠️ REACT_APP_GEMINI_API_KEY is not set. Gemini features will not work.');
  console.warn('💡 To fix: Add REACT_APP_GEMINI_API_KEY=your-key-here to your .env file and restart the dev server');
  console.warn('💡 Current env check:', {
    hasKey: !!process.env.REACT_APP_GEMINI_API_KEY,
    keyLength: process.env.REACT_APP_GEMINI_API_KEY?.length || 0,
    allReactAppVars: Object.keys(process.env).filter(k => k.startsWith('REACT_APP_'))
  });
} else {
  console.log('✅ Gemini API key loaded successfully');
  console.log('🔑 API Key length:', GEMINI_API_KEY.length, 'characters');
}

// Initialize Gemini AI
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Helper function to check if API key is available
export function isGeminiAvailable(): boolean {
  return !!GEMINI_API_KEY && !!genAI;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  category: 'beginner' | 'intermediate' | 'expert';
  field: string;
  subfield: string;
}

export interface InterviewQuestionsResponse {
  beginner: InterviewQuestion[];
  intermediate: InterviewQuestion[];
  expert: InterviewQuestion[];
}

export interface AnswerEvaluation {
  marks: number;
  feedback: string;
}

export interface AudioAnswerEvaluation {
  marks: number;
  confidence_marks: number;
  fluency_marks: number;
  feedback: string;
}

export class GeminiService {
  private static instance: GeminiService;
  private model: any;

  private constructor() {
    if (!genAI) {
      throw new Error('Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY environment variable.');
    }
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async askQuestion(question: string, systemInstruction?: string): Promise<string> {
    try {
      console.log('📤 Making Gemini API call for question:', question.substring(0, 50) + '...');
      const prompt = `${systemInstruction ? systemInstruction + "\n\n" : ''}User question: ${question}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = typeof response.text === 'function' ? response.text() : String(response);
      console.log('✅ Gemini API response received, length:', text.length);
      return text?.trim() || 'No response';
    } catch (error: any) {
      console.error('❌ Gemini API call failed:', error);
      console.error('Error details:', error.message, error.stack);
      
      // Handle specific API key errors
      if (error.message && error.message.includes('leaked')) {
        throw new Error('Your Gemini API key has been reported as leaked. Please generate a new API key from https://makersuite.google.com/app/apikey and update REACT_APP_GEMINI_API_KEY in your .env file.');
      } else if (error.message && error.message.includes('403')) {
        throw new Error('API key access denied. Please check your Gemini API key is valid and has proper permissions.');
      }
      
      throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
    }
  }

  public static getInstance(): GeminiService {
    // Check API key at runtime as well
    const runtimeKey = process.env.REACT_APP_GEMINI_API_KEY || '';
    if (!runtimeKey) {
      const error = new Error('Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY environment variable.');
      console.error('❌ Gemini Service Error:', error.message);
      console.error('💡 Make sure REACT_APP_GEMINI_API_KEY is set in your .env file and restart the dev server');
      console.error('🔍 Debug info:', {
        moduleLoadKey: !!GEMINI_API_KEY,
        runtimeKey: !!runtimeKey,
        envKeys: Object.keys(process.env).filter(k => k.startsWith('REACT_APP_'))
      });
      throw error;
    }
    
    if (!GeminiService.instance) {
      try {
        GeminiService.instance = new GeminiService();
        console.log('✅ Gemini Service initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini Service:', error);
        throw error;
      }
    }
    return GeminiService.instance;
  }

  // Helper method to list available models (for debugging)
  static async listAvailableModels(): Promise<void> {
    try {
      if (!GEMINI_API_KEY) {
        console.error('Gemini API key is not configured');
        return;
      }
      // Note: This requires using the REST API directly
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
      const data = await response.json();
      console.log('Available Gemini models:', data);
      return data;
    } catch (error) {
      console.error('Error listing models:', error);
    }
  }

  async generateInterviewQuestions(
    field: string,
    subfield: string,
    customNotes?: string
  ): Promise<InterviewQuestionsResponse> {
    try {
      console.log('🚀 Generating questions for:', { field, subfield, customNotes });
      console.log('📤 Making Gemini API call...');
      const prompt = this.buildPrompt(field, subfield, customNotes);
      console.log('📝 Generated prompt:', prompt.substring(0, 200) + '...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini API response received, length:', text.length);
      console.log('🤖 Parsing response...');
      return this.parseGeminiResponse(text);
    } catch (error: any) {
      console.error('❌ Error generating questions:', error);
      console.error('Error details:', error.message, error.stack);
      
      // Handle specific API key errors
      if (error.message && error.message.includes('leaked')) {
        throw new Error('Your Gemini API key has been reported as leaked. Please generate a new API key from https://makersuite.google.com/app/apikey and update REACT_APP_GEMINI_API_KEY in your .env file.');
      } else if (error.message && error.message.includes('403')) {
        throw new Error('API key access denied. Please check your Gemini API key is valid and has proper permissions.');
      }
      
      throw new Error(`Failed to generate interview questions: ${error.message || 'Unknown error'}`);
    }
  }

  private buildPrompt(field: string, subfield: string, customNotes?: string): string {
    console.log('🔍 Building prompt for field:', field, 'subfield:', subfield);
    const basePrompt = `Generate 24 interview questions specifically for ${field} programming language/technology - ${subfield} position.

CRITICAL: All questions must be about ${field} specifically, NOT JavaScript or any other language.

Requirements:
- 8 Beginner questions (basic ${field} concepts, fundamental knowledge)
- 8 Intermediate questions (practical ${field} experience, problem-solving)
- 8 Expert questions (advanced ${field} concepts, leadership, architecture)

${customNotes ? `Additional focus areas: ${customNotes}` : ''}

IMPORTANT: Create REALISTIC INTERVIEW ANSWERS:
- Answers should be 3-4 sentences max, conversational tone
- Use "I" statements like "I would...", "I use...", "I can..."
- Include practical examples and real-world scenarios
- Sound like how an experienced developer would actually speak in an interview
- Focus on demonstrating knowledge through examples, not just definitions
- All answers must be specific to ${field} programming language/technology

Format the response as a JSON object with this exact structure:
{
  "beginner": [
    {
      "id": "b1",
      "question": "Question text here",
      "answer": "Realistic interview answer with practical examples (3-4 sentences)",
      "category": "beginner",
      "field": "${field}",
      "subfield": "${subfield}"
    }
  ],
  "intermediate": [...],
  "expert": [...]
}

Make questions relevant and practical. Focus on real-world scenarios that interviewers actually ask for ${field} developers.`;

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

      // Clean up each question to ensure consistent structure
      const cleanQuestions = (questions: any[]) => {
        return questions.slice(0, 8).map(q => ({
          id: q.id || `q${Math.random().toString(36).substr(2, 9)}`,
          question: q.question || 'Question not provided',
          answer: q.answer || 'Answer not provided',
          category: q.category || 'beginner',
          field: q.field || 'Information Technology',
          subfield: q.subfield || 'Developer'
        }));
      };

      return {
        beginner: cleanQuestions(parsed.beginner),
        intermediate: cleanQuestions(parsed.intermediate),
        expert: cleanQuestions(parsed.expert)
      };
    } catch (error) {
      throw new Error('Failed to parse questions. Please try again.');
    }
  }


  async evaluateAnswer(question: string, answer: string): Promise<AnswerEvaluation> {
    const prompt = `Evaluate the following answer to the question: "${question}". 
    
Student Answer: "${answer}"

Please evaluate this answer and provide:
1. Marks out of 10 (be fair and realistic)
2. SHORT feedback - maximum 2 sentences

Return your response in this exact JSON format:
{
  "marks": 8,
  "feedback": "Good understanding of basics. Add specific examples to improve."
}

Keep feedback brief and actionable. Be encouraging but honest.`;
    
    try {
      console.log('📤 Making Gemini API call for answer evaluation...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response.text();
      console.log('✅ Gemini API response received for evaluation');
      
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (typeof parsed.marks !== 'number' || typeof parsed.feedback !== 'string') {
        throw new Error('Invalid response structure from Gemini');
      }

      // Ensure marks are within valid range (0-10)
      const marks = Math.max(0, Math.min(10, parsed.marks));
      
      return {
        marks: marks,
        feedback: parsed.feedback
      };
    } catch (error: any) {
      console.error('❌ Error evaluating answer:', error);
      console.error('Error details:', error.message);
      
      // Handle specific API key errors
      if (error.message && error.message.includes('leaked')) {
        throw new Error('Your Gemini API key has been reported as leaked. Please generate a new API key from https://makersuite.google.com/app/apikey and update REACT_APP_GEMINI_API_KEY in your .env file.');
      } else if (error.message && error.message.includes('403')) {
        throw new Error('API key access denied. Please check your Gemini API key is valid and has proper permissions.');
      }
      
      // Throw error instead of returning default - let the caller handle it
      throw new Error(`Failed to evaluate answer: ${error.message || 'Unknown error'}`);
    }
  }


  async evaluateAudioAnswer(question: string, audioBlob: Blob): Promise<AudioAnswerEvaluation> {
    try {
      // Convert audio blob to base64 for Gemini
      const arrayBuffer = await audioBlob.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const base64Audio = btoa(Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join(''))
      
      // Get the model that supports audio
      if (!genAI) {
        throw new Error('Gemini API key is not configured');
      }
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      
      const prompt = `You are an expert interview evaluator. Analyze this audio answer to the question: "${question}"

Please evaluate the audio answer and provide a detailed assessment in the following JSON format:

{
  "marks": number (0-100),
  "confidence_marks": number (0-100),
  "fluency_marks": number (0-100),
  "feedback": string (max 3 sentences, be specific and actionable),
  "strengths": string (max 2 sentences),
  "areas_for_improvement": string (max 2 sentences)
}

Evaluation Criteria:
- Marks: Overall quality and accuracy of the answer
- Confidence: How confident and assured the speaker sounds
- Fluency: How smoothly and clearly the speech flows
- Feedback: Specific, actionable advice for improvement (max 3 sentences)

Please ensure the response is valid JSON.`

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: audioBlob.type || "audio/wav",
            data: base64Audio
          }
        }
      ])

      const response = await result.response
      const text = response.text()
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini')
      }
      
      const evaluation = JSON.parse(jsonMatch[0])
      
      return {
        marks: evaluation.marks || 0,
        confidence_marks: evaluation.confidence_marks || 0,
        fluency_marks: evaluation.fluency_marks || 0,
        feedback: evaluation.feedback || 'No feedback provided',
      }
    } catch (error: any) {
      console.error('❌ Error evaluating audio answer:', error);
      
      // Handle specific API key errors
      if (error.message && error.message.includes('leaked')) {
        throw new Error('Your Gemini API key has been reported as leaked. Please generate a new API key from https://makersuite.google.com/app/apikey and update REACT_APP_GEMINI_API_KEY in your .env file.');
      } else if (error.message && error.message.includes('403')) {
        throw new Error('API key access denied. Please check your Gemini API key is valid and has proper permissions.');
      }
      
      throw new Error(`Failed to evaluate audio answer: ${error.message || 'Unknown error'}`)
    }
  }
}

export default GeminiService;
