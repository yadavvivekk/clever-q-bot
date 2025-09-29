import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizQuestion } from '@/services/aiService';

export type QuizScreen = 'topic-selection' | 'loading' | 'quiz' | 'results';

export interface QuizState {
  currentScreen: QuizScreen;
  selectedTopic: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: number[];
  score: number;
  isLoading: boolean;
  error: string | null;
  feedback: {
    feedback: string;
    scoreMessage: string;
  } | null;
}

type QuizAction =
  | { type: 'SET_TOPIC'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_QUESTIONS'; payload: QuizQuestion[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SCREEN'; payload: QuizScreen }
  | { type: 'ANSWER_QUESTION'; payload: { questionIndex: number; answerIndex: number } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'SET_FEEDBACK'; payload: { feedback: string; scoreMessage: string } }
  | { type: 'RESET_QUIZ' };

const initialState: QuizState = {
  currentScreen: 'topic-selection',
  selectedTopic: '',
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  isLoading: false,
  error: null,
  feedback: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_TOPIC':
      return { ...state, selectedTopic: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_QUESTIONS':
      return { 
        ...state, 
        questions: action.payload, 
        answers: new Array(action.payload.length).fill(-1),
        isLoading: false,
        error: null 
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.payload };
    
    case 'ANSWER_QUESTION': {
      const newAnswers = [...state.answers];
      newAnswers[action.payload.questionIndex] = action.payload.answerIndex;
      return { ...state, answers: newAnswers };
    }
    
    case 'NEXT_QUESTION':
      return { 
        ...state, 
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1) 
      };
    
    case 'PREVIOUS_QUESTION':
      return { 
        ...state, 
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0) 
      };
    
    case 'SET_FEEDBACK': {
      const score = state.answers.reduce((acc, answer, index) => {
        return acc + (answer === state.questions[index]?.correctAnswer ? 1 : 0);
      }, 0);
      
      return { 
        ...state, 
        feedback: action.payload, 
        score,
        currentScreen: 'results' 
      };
    }
    
    case 'RESET_QUIZ':
      return initialState;
    
    default:
      return state;
  }
}

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}