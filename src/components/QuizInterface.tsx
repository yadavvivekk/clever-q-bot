import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuiz } from '@/contexts/QuizContext';
import { aiService } from '@/services/aiService';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuizInterface() {
  const { state, dispatch } = useQuiz();
  const { questions, currentQuestionIndex, answers, selectedTopic } = state;
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = answers.every(answer => answer !== -1);

  const handleAnswerSelect = (answerIndex: number) => {
    dispatch({ 
      type: 'ANSWER_QUESTION', 
      payload: { questionIndex: currentQuestionIndex, answerIndex } 
    });
  };

  const handleNext = () => {
    if (isLastQuestion && allQuestionsAnswered) {
      handleFinishQuiz();
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const handleFinishQuiz = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const score = answers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index]?.correctAnswer ? 1 : 0);
      }, 0);

      const feedback = await aiService.generateFeedback(score, questions.length, selectedTopic);
      dispatch({ type: 'SET_FEEDBACK', payload: feedback });
    } catch (error) {
      console.error('Failed to generate feedback:', error);
      // Fallback feedback
      const score = answers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index]?.correctAnswer ? 1 : 0);
      }, 0);
      
      dispatch({ 
        type: 'SET_FEEDBACK', 
        payload: {
          feedback: `Great effort! You completed the ${selectedTopic} quiz.`,
          scoreMessage: `You scored ${score} out of ${questions.length}!`
        }
      });
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{selectedTopic} Quiz</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-muted" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "w-full p-4 h-auto text-left justify-start transition-all duration-200",
                    currentAnswer === index 
                      ? "bg-primary text-primary-foreground border-primary shadow-md" 
                      : "hover:bg-muted/50 hover:border-primary/50"
                  )}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      currentAnswer === index 
                        ? "bg-white border-white" 
                        : "border-muted-foreground"
                    )}>
                      {currentAnswer === index && (
                        <Check className="w-3 h-3 text-primary" />
                      )}
                    </div>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {answers.filter(a => a !== -1).length} of {questions.length} answered
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentAnswer === -1}
            className={cn(
              "flex items-center space-x-2",
              isLastQuestion && allQuestionsAnswered
                ? "bg-success hover:bg-success/90"
                : ""
            )}
          >
            <span>
              {isLastQuestion && allQuestionsAnswered ? "Finish Quiz" : "Next"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'quiz' })}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                index === currentQuestionIndex
                  ? "bg-primary scale-125"
                  : answers[index] !== -1
                  ? "bg-success"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}