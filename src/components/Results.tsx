import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuiz } from '@/contexts/QuizContext';
import { Trophy, RotateCcw, Check, X, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Results() {
  const { state, dispatch } = useQuiz();
  const { questions, answers, score, feedback, selectedTopic } = state;
  
  const percentage = Math.round((score / questions.length) * 100);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  const handleRetry = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const handleNewTopic = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-quiz-gradient rounded-full mb-6 shadow-card-glow">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Quiz Complete!</h1>
          <p className="text-xl text-muted-foreground">{selectedTopic}</p>
        </div>

        {/* Score Card */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold">
              <span className={getScoreColor(percentage)}>{score}</span>
              <span className="text-muted-foreground">/{questions.length}</span>
            </CardTitle>
            <div className="flex justify-center mt-4">
              <Badge variant={getScoreBadgeVariant(percentage)} className="text-lg px-4 py-2">
                {percentage}% Correct
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {feedback && (
              <>
                <h3 className="text-xl font-semibold text-primary">
                  {feedback.scoreMessage}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {feedback.feedback}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Question Review</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={index} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-medium",
                        isCorrect ? "bg-success" : "bg-destructive"
                      )}>
                        {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-2">
                          {index + 1}. {question.question}
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Your answer:</span>
                            <span className={cn(
                              "text-sm font-medium",
                              isCorrect ? "text-success" : "text-destructive"
                            )}>
                              {question.options[userAnswer]}
                            </span>
                          </div>
                          
                          {!isCorrect && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">Correct answer:</span>
                              <span className="text-sm font-medium text-success">
                                {question.options[question.correctAnswer]}
                              </span>
                            </div>
                          )}
                          
                          {question.explanation && (
                            <div className="mt-2 p-3 bg-muted/30 rounded text-sm text-muted-foreground">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="flex items-center space-x-2 min-w-[180px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry This Topic</span>
          </Button>
          
          <Button
            onClick={handleNewTopic}
            className="flex items-center space-x-2 min-w-[180px] bg-quiz-gradient hover:opacity-90"
          >
            <Trophy className="w-4 h-4" />
            <span>Try New Topic</span>
          </Button>
        </div>
      </div>
    </div>
  );
}