import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/contexts/QuizContext';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';
import { Brain, Heart, Laptop, Globe, Lightbulb, BookOpen } from 'lucide-react';

const topics = [
  {
    id: 'wellness',
    name: 'Wellness & Health',
    description: 'Mental health, nutrition, fitness, and well-being practices',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'tech-trends',
    name: 'Tech Trends',
    description: 'Latest technology developments, AI, and digital innovation',
    icon: Laptop,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'science',
    name: 'Science & Discovery',
    description: 'Scientific breakthroughs, space exploration, and research',
    icon: Brain,
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'environment',
    name: 'Environment & Climate',
    description: 'Climate change, sustainability, and environmental science',
    icon: Globe,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'creativity',
    name: 'Creativity & Arts',
    description: 'Creative processes, art history, and cultural trends',
    icon: Lightbulb,
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'general-knowledge',
    name: 'General Knowledge',
    description: 'History, geography, culture, and interesting facts',
    icon: BookOpen,
    gradient: 'from-gray-500 to-slate-500'
  }
];

export default function TopicSelection() {
  const { dispatch } = useQuiz();

  const handleTopicSelect = async (topicId: string, topicName: string) => {
    try {
      dispatch({ type: 'SET_TOPIC', payload: topicName });
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_SCREEN', payload: 'loading' });

      const quizData = await aiService.generateQuestions(topicName);
      dispatch({ type: 'SET_QUESTIONS', payload: quizData.questions });
      dispatch({ type: 'SET_SCREEN', payload: 'quiz' });
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate quiz questions. Please try again.' });
      dispatch({ type: 'SET_SCREEN', payload: 'topic-selection' });
      toast({
        title: "Error",
        description: "Failed to generate quiz questions. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-quiz-gradient rounded-full mb-6 shadow-card-glow">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            AI Knowledge Quiz
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a topic and test your knowledge with AI-generated questions tailored just for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <Card 
                key={topic.id} 
                className="group hover:shadow-card-glow transition-all duration-300 hover:scale-105 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm"
                onClick={() => handleTopicSelect(topic.id, topic.name)}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${topic.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {topic.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {topic.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Each quiz contains 5 AI-generated questions • Get personalized feedback based on your performance
          </p>
        </div>
      </div>
    </div>
  );
}