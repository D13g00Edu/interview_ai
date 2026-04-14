'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type InterviewState = {
  name: string;
  position: string;
  level: string;
  type: string;
  currentStep: number;
  answers: string[];
  questions: string[];
  sessionId: string | null;
  loading: boolean;
};

type InterviewContextType = {
  state: InterviewState;
  updateInfo: (info: Partial<InterviewState>) => void;
  addAnswer: (answer: string) => void;
  generateQuestions: () => Promise<void>;
  reset: () => void;
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InterviewState>({
    name: '',
    position: '',
    level: 'Junior (Principiante)',
    type: 'Comportamiento (Behavioral)',
    currentStep: 1,
    answers: [],
    questions: [],
    sessionId: null,
    loading: false,
  });

  // Persist to session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('interview_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ 
          ...prev, 
          ...parsed,
          answers: parsed.answers || [],
          questions: parsed.questions || []
        }));
      } catch (e) {
        console.error('Failed to parse session state', e);
      }
    }
  }, []);

  const updateInfo = (info: Partial<InterviewState>) => {
    const newState = { ...state, ...info };
    setState(newState);
    sessionStorage.setItem('interview_state', JSON.stringify(newState));
  };

  const generateQuestions = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: state.position,
          level: state.level,
          type: state.type,
          name: state.name
        }),
      });
      const data = await res.json();
      const updatedState = { 
        ...state, 
        questions: data.questions, 
        sessionId: data.sessionId,
        loading: false 
      };
      setState(updatedState);
      sessionStorage.setItem('interview_state', JSON.stringify(updatedState));
    } catch (error) {
      console.error('Error generating questions:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const addAnswer = (answer: string) => {
    const newState = {
      ...state,
      answers: [...state.answers, answer],
      currentStep: state.currentStep + 1,
    };
    setState(newState);
    sessionStorage.setItem('interview_state', JSON.stringify(newState));
    
    // Proactively evaluate in background
    fetch('/api/evaluate-answer', {
       method: 'POST',
       body: JSON.stringify({
         sessionId: state.sessionId,
         question: state.questions[state.currentStep - 1],
         answer: answer
       })
    });
  };

  const reset = () => {
    const initialState = {
      name: '',
      position: '',
      level: 'Junior (Principiante)',
      type: 'Comportamiento (Behavioral)',
      currentStep: 1,
      answers: [],
      questions: [],
      sessionId: null,
      loading: false,
    };
    setState(initialState);
    sessionStorage.removeItem('interview_state');
  };

  return (
    <InterviewContext.Provider value={{ state, updateInfo, addAnswer, generateQuestions, reset }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
