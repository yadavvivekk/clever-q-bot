import { QuizProvider, useQuiz } from '@/contexts/QuizContext';
import TopicSelection from '@/components/TopicSelection';
import LoadingScreen from '@/components/LoadingScreen';
import QuizInterface from '@/components/QuizInterface';
import Results from '@/components/Results';
import ErrorDisplay from '@/components/ErrorDisplay';

function QuizApp() {
  const { state } = useQuiz();

  if (state.error) {
    return <ErrorDisplay />;
  }

  switch (state.currentScreen) {
    case 'topic-selection':
      return <TopicSelection />;
    case 'loading':
      return <LoadingScreen />;
    case 'quiz':
      return <QuizInterface />;
    case 'results':
      return <Results />;
    default:
      return <TopicSelection />;
  }
}

const Index = () => {
  return (
    <QuizProvider>
      <QuizApp />
    </QuizProvider>
  );
};

export default Index;
