import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/contexts/QuizContext';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorDisplay() {
  const { state, dispatch } = useQuiz();

  const handleRetry = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_SCREEN', payload: 'topic-selection' });
  };

  const handleGoHome = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="border-destructive/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="inline-block p-3 bg-destructive/10 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {state.error || 'An unexpected error occurred while generating your quiz.'}
            </p>
            
            <div className="flex flex-col space-y-3">
              <Button onClick={handleRetry} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button onClick={handleGoHome} variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Back to Topics
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              If the problem persists, please check your internet connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}