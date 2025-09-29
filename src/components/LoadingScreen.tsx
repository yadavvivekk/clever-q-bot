import { useQuiz } from '@/contexts/QuizContext';
import { Loader2, Brain, Sparkles } from 'lucide-react';

export default function LoadingScreen() {
  const { state } = useQuiz();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-quiz-gradient rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="relative p-6 bg-quiz-gradient rounded-full shadow-card-glow">
            <Brain className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-foreground">
            Generating Your Quiz
          </h2>
          
          <p className="text-lg text-muted-foreground">
            AI is crafting personalized questions about{' '}
            <span className="text-primary font-semibold">{state.selectedTopic}</span>
          </p>

          <div className="flex items-center justify-center space-x-2 mt-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              This usually takes a few seconds...
            </span>
          </div>

          <div className="mt-8 space-y-2">
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Creating 5 multiple choice questions...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}