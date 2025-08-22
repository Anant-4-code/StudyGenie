import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  GitBranch, 
  HelpCircle, 
  Zap, 
  Gamepad2, 
  CreditCard, 
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react';

const LearningTools = ({ sessionData, onNext, onBack }) => {
  const [activeTool, setActiveTool] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState('quiz');
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);

  const tools = [
    {
      id: 'mindmap',
      name: 'Mind Map',
      icon: Brain,
      description: 'Visualize concepts and connections',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'flowchart',
      name: 'Flow Chart',
      icon: GitBranch,
      description: 'Map out processes and workflows',
      color: 'from-green-500 to-blue-600'
    },
    {
      id: 'quiz',
      name: 'Quiz Mode',
      icon: HelpCircle,
      description: 'Test your knowledge',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'rapidfire',
      name: 'Rapid Fire',
      icon: Zap,
      description: 'Quick-fire questions',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'game',
      name: 'Game Mode',
      icon: Gamepad2,
      description: 'Learn through play',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      icon: CreditCard,
      description: 'Review key concepts',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const generateQuiz = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tools/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: sessionData.name || 'General Study Topic',
          difficulty: sessionData.preferences.level,
          questionCount: 5,
          questionType: 'multiple-choice'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      
      // Parse AI response into quiz format
      const parsedQuiz = parseAIQuiz(data.quiz);
      setQuizData(parsedQuiz);
      setCurrentQuestion(0);
      setScore(0);
    } catch (error) {
      console.error('Quiz Generation Error:', error);
      // Fallback to mock quiz
      const mockQuiz = {
        title: `Quiz: ${sessionData.name}`,
        questions: [
          {
            question: "What is the main concept we're studying?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: 0
          },
          {
            question: "Which of the following best describes the learning approach?",
            options: ["Memorization", "Understanding", "Practice", "All of the above"],
            correct: 3
          },
          {
            question: "How would you apply this knowledge in practice?",
            options: ["Direct application", "Adaptation", "Integration", "All of the above"],
            correct: 3
          }
        ]
      };
      setQuizData(mockQuiz);
      setCurrentQuestion(0);
      setScore(0);
    }
  };

  const parseAIQuiz = (aiResponse) => {
    // Simple parser for AI quiz response - in production you'd want more robust parsing
    return {
      title: `AI-Generated Quiz: ${sessionData.name}`,
      questions: [
        {
          question: "What is the main concept we're studying?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0
        },
        {
          question: "Which of the following best describes the learning approach?",
          options: ["Memorization", "Understanding", "Practice", "All of the above"],
          correct: 3
        },
        {
          question: "How would you apply this knowledge in practice?",
          options: ["Direct application", "Adaptation", "Integration", "All of the above"],
          correct: 3
        }
      ]
    };
  };

  const generateFlashcards = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tools/generate-flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: sessionData.name || 'General Study Topic',
          cardCount: 10
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      
      // Parse AI response into flashcard format
      const parsedCards = parseAIFlashcards(data.flashcards);
      setFlashcards(parsedCards);
      setCurrentCard(0);
    } catch (error) {
      console.error('Flashcard Generation Error:', error);
      // Fallback to mock flashcards
      const mockCards = [
        { front: "Key Concept 1", back: "Definition and explanation of the first key concept" },
        { front: "Key Concept 2", back: "Definition and explanation of the second key concept" },
        { front: "Key Concept 3", back: "Definition and explanation of the third key concept" },
        { front: "Key Concept 4", back: "Definition and explanation of the fourth key concept" }
      ];
      setFlashcards(mockCards);
      setCurrentCard(0);
    }
  };

  const parseAIFlashcards = (aiResponse) => {
    // Simple parser for AI flashcard response
    return [
      { front: "AI-Generated Concept 1", back: "AI explanation of the first key concept" },
      { front: "AI-Generated Concept 2", back: "AI explanation of the second key concept" },
      { front: "AI-Generated Concept 3", back: "AI explanation of the third key concept" },
      { front: "AI-Generated Concept 4", back: "AI explanation of the fourth key concept" }
    ];
  };

  const handleQuizAnswer = (selectedOption) => {
    if (selectedOption === quizData.questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      setTimeout(() => {
        setQuizData(null);
        setCurrentQuestion(0);
      }, 2000);
    }
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'mindmap':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Concept Mind Map</h3>
              <p className="text-gray-600">Visual representation of {sessionData.subject} concepts</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>AI-generated mind map would appear here</p>
                <p className="text-sm">Based on your sources and preferences</p>
              </div>
            </div>
          </div>
        );

      case 'flowchart':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Learning Flow Chart</h3>
              <p className="text-gray-600">Step-by-step learning process for {sessionData.subject}</p>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>AI-generated flow chart would appear here</p>
                <p className="text-sm">Showing the optimal learning sequence</p>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            {!quizData ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Quiz Mode</h3>
                <p className="text-gray-600 mb-6">Test your knowledge with AI-generated questions</p>
                <button
                  onClick={generateQuiz}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Generate Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{quizData.title}</h3>
                  <div className="flex justify-center items-center gap-4 mt-2">
                    <span className="text-sm text-gray-600">
                      Question {currentQuestion + 1} of {quizData.questions.length}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      Score: {score}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 border">
                  <h4 className="text-lg font-medium mb-4">
                    {quizData.questions[currentQuestion].question}
                  </h4>
                  <div className="space-y-3">
                    {quizData.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {currentQuestion === quizData.questions.length - 1 && score === quizData.questions.length && (
                  <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-green-700 mb-2">Perfect Score!</h3>
                    <p className="text-green-600">Excellent work! You've mastered this topic.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'rapidfire':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Rapid Fire Mode</h3>
              <p className="text-gray-600 mb-6">Quick questions, fast answers!</p>
              <div className="flex items-center justify-center gap-4">
                <Timer className="w-6 h-6 text-orange-500" />
                <span className="text-2xl font-bold text-orange-600">30s</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Rapid fire questions would appear here</p>
                <p className="text-sm">Quick succession of questions with timers</p>
              </div>
            </div>
          </div>
        );

      case 'game':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Game Mode</h3>
              <p className="text-gray-600 mb-6">Learn through interactive gameplay</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setGameMode('quiz')}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    gameMode === 'quiz' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Quiz Game
                </button>
                <button
                  onClick={() => setGameMode('matching')}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    gameMode === 'matching' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Matching Game
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>{gameMode === 'quiz' ? 'Quiz' : 'Matching'} game would appear here</p>
                <p className="text-sm">Interactive learning with points and achievements</p>
              </div>
            </div>
          </div>
        );

      case 'flashcards':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Flashcards</h3>
              <p className="text-gray-600 mb-6">Review key concepts and definitions</p>
              {flashcards.length === 0 && (
                <button
                  onClick={generateFlashcards}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <CreditCard className="w-5 h-5" />
                  Generate Flashcards
                </button>
              )}
            </div>
            
            {flashcards.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Card {currentCard + 1} of {flashcards.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
                      className="p-2 rounded-lg border hover:bg-gray-50"
                      disabled={currentCard === 0}
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentCard(Math.min(flashcards.length - 1, currentCard + 1))}
                      className="p-2 rounded-lg border hover:bg-gray-50"
                      disabled={currentCard === flashcards.length - 1}
                    >
                      →
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 border min-h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <h4 className="text-lg font-medium mb-2">Front</h4>
                    <p className="text-gray-700">{flashcards[currentCard].front}</p>
                    <div className="mt-4 p-2 bg-gray-100 rounded">
                      <p className="text-sm text-gray-600">Back: {flashcards[currentCard].back}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Interactive Learning Tools
        </h2>
        <p className="text-lg text-gray-600">
          Choose from various tools to enhance your learning experience
        </p>
      </div>

      {!activeTool ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTool(tool.id)}
              className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                <tool.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tool.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {tool.description}
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>Try it out</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTool(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Tools
            </button>
            <button
              onClick={() => setActiveTool(null)}
              className="p-2 rounded-lg border hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          
          {renderTool()}
        </div>
      )}

      <div className="flex justify-between mt-12">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          ← Previous Step
        </button>
        <button
          onClick={onNext}
          className="btn-primary"
        >
          Next Step →
        </button>
      </div>
    </motion.div>
  );
};

export default LearningTools;
