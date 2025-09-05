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
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async askQuestion(question: string, systemInstruction?: string): Promise<string> {
    try {
      const prompt = `${systemInstruction ? systemInstruction + "\n\n" : ''}User question: ${question}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = typeof response.text === 'function' ? response.text() : String(response);
      return text?.trim() || 'No response';
    } catch (error) {
      return 'Sorry, I could not get an answer right now. Please try again later.';
    }
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
      console.log('🚀 Generating questions for:', { field, subfield, customNotes });
      const prompt = this.buildPrompt(field, subfield, customNotes);
      console.log('📝 Generated prompt:', prompt.substring(0, 200) + '...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 Gemini response length:', text.length);
      return this.parseGeminiResponse(text);
    } catch (error) {
      console.error('❌ Error generating questions:', error);
      throw new Error('Failed to generate interview questions. Please try again.');
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
      const result = await this.model.generateContent(prompt);
      const response = await result.response.text();
      
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
    } catch (error) {
      // Return default response if evaluation fails
      return {
        marks: 5,
        feedback: "Unable to evaluate answer at this time. Please try again or contact support."
      };
    }
  }


  async evaluateAudioAnswer(question: string, audioBlob: Blob): Promise<AudioAnswerEvaluation> {
    try {
      // Convert audio blob to base64 for Gemini
      const arrayBuffer = await audioBlob.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const base64Audio = btoa(Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join(''))
      
      // Get the model that supports audio
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
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
    } catch (error) {
      throw new Error('Failed to evaluate audio answer')
    }
  }
}

export default GeminiService;
