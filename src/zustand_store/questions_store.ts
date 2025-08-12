import { create } from 'zustand'
import { InterviewQuestionsResponse } from '../services/geminiService'

interface QuestionsState {
  questions: InterviewQuestionsResponse | null
  setQuestions: (questions: InterviewQuestionsResponse) => void
  clearQuestions: () => void
}

export const useQuestionsStore = create<QuestionsState>((set) => ({
  questions: null,
  setQuestions: (questions: InterviewQuestionsResponse) => set({ questions }),
  clearQuestions: () => set({ questions: null })
}))
