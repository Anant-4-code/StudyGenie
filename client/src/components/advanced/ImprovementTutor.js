import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Star,
  Award,
  Clock,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';

const ImprovementTutor = ({ sessionData, onBack, onRestart }) => {
  const [improvementData, setImprovementData] = useState(null);
  const [selectedFocus, setSelectedFocus] = useState('weaknesses');

  useEffect(() => {
    // Simulate loading improvement analysis
    setTimeout(() => {
      setImprovementData({
        sessionSummary: {
          totalTime: '45 minutes',
          topicsCovered: 3,
          overallScore: 83.3,
          strengths: ['Concept Understanding', 'Quick Learning', 'Consistent Performance'],
          weaknesses: ['Application Skills', 'Time Management', 'Advanced Problem Solving'],
          nextSessionFocus: 'Application and Practice'
        },
        improvementAreas: [
          {
            category: 'Application Skills',
            currentLevel: 'Intermediate',
            targetLevel: 'Advanced',
            description: 'Focus on applying concepts to real-world scenarios',
            exercises: ['Case Studies', 'Problem Sets', 'Practical Projects'],
            estimatedTime: '2-3 hours'
          },
          {
            category: 'Time Management',
            currentLevel: 'Basic',
            targetLevel: 'Intermediate',
            description: 'Improve efficiency in problem-solving',
            exercises: ['Timed Quizzes', 'Speed Drills', 'Efficiency Training'],
            estimatedTime: '1-2 hours'
          },
          {
            category: 'Advanced Problem Solving',
            currentLevel: 'Beginner',
            targetLevel: 'Intermediate',
            description: 'Develop complex problem-solving strategies',
            exercises: ['Multi-step Problems', 'Critical Thinking', 'Strategy Development'],
            estimatedTime: '3-4 hours'
          }
        ],
        nextSteps: [
          {
            title: 'Practice Application',
            description: 'Complete 5 real-world problem sets',
            priority: 'High',
            deadline: 'Next 3 days',
            resources: ['Practice Problems', 'Video Tutorials', 'Peer Discussion']
          },
          {
            title: 'Review Weak Concepts',
            description: 'Revisit topics where you scored below 80%',
            priority: 'Medium',
            deadline: 'Next week',
            resources: ['Concept Videos', 'Reading Materials', 'Quiz Review']
          },
          {
            title: 'Advanced Topics',
            description: 'Explore next-level concepts in the subject',
            priority: 'Low',
            deadline: 'Next 2 weeks',
            resources: ['Advanced Materials', 'Expert Sessions', 'Research Papers']
          }
        ],
        recommendations: [
          'Schedule regular practice sessions (3-4 times per week)',
          'Use spaced repetition for better retention',
          'Join study groups for collaborative learning',
          'Track progress weekly to identify patterns',
          'Celebrate small wins to maintain motivation'
        ]
      });
    }, 1500);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderImprovementAreas = () => {
    return (
      <div className="space-y-4">
        {improvementData.improvementAreas.map((area, index) => (
          <motion.div
            key={area.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 border shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {area.category}
                </h4>
                <p className="text-gray-600 mb-3">{area.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Current</div>
                <div className="font-semibold text-blue-600">{area.currentLevel}</div>
                <div className="text-sm text-gray-500 mt-1">Target</div>
                <div className="font-semibold text-green-600">{area.targetLevel}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Recommended Exercises:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {area.exercises.map((exercise) => (
                    <span key={exercise} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {exercise}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                Estimated time: {area.estimatedTime}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderNextSteps = () => {
    return (
      <div className="space-y-4">
        {improvementData.nextSteps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 border shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600 mb-3">{step.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(step.priority)}`}>
                {step.priority}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Deadline: {step.deadline}
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Resources:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {step.resources.map((resource) => (
                    <span key={resource} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  if (!improvementData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your performance and generating improvement plan...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🎯 Your Personalized Improvement Plan
        </h2>
        <p className="text-lg text-gray-600">
          Based on your performance in {sessionData.subject}, here's how to level up your learning
        </p>
      </div>

      {/* Session Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Session Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-gray-900">{improvementData.sessionSummary.totalTime}</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          <div className="text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-900">{improvementData.sessionSummary.topicsCovered}</div>
            <div className="text-sm text-gray-600">Topics Covered</div>
          </div>
          <div className="text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-gray-900">{improvementData.sessionSummary.overallScore}%</div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
          <div className="text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-gray-900">{improvementData.sessionSummary.nextSessionFocus}</div>
            <div className="text-sm text-gray-600">Next Focus</div>
          </div>
        </div>
      </motion.div>

      {/* Focus Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedFocus('weaknesses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              selectedFocus === 'weaknesses'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Improvement Areas
          </button>
          <button
            onClick={() => setSelectedFocus('nextsteps')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              selectedFocus === 'nextsteps'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target className="w-4 h-4" />
            Next Steps
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-8">
        {selectedFocus === 'weaknesses' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Areas for Improvement</h3>
            {renderImprovementAreas()}
          </div>
        )}
        
        {selectedFocus === 'nextsteps' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Recommended Next Steps</h3>
            {renderNextSteps()}
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 mb-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          AI Learning Recommendations
        </h3>
        <div className="space-y-3">
          {improvementData.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{recommendation}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={onRestart}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <RefreshCw className="w-5 h-5" />
          Start New Session
        </button>
        <button className="btn-secondary flex items-center gap-2 justify-center">
          <Download className="w-5 h-5" />
          Download Report
        </button>
        <button className="btn-secondary flex items-center gap-2 justify-center">
          <Share2 className="w-5 h-5" />
          Share Progress
        </button>
      </div>

      {/* Final Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="btn-secondary"
        >
          ← Previous Step
        </button>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Session Complete! 🎉</p>
          <p className="text-xs text-gray-500">You've made great progress today</p>
        </div>
        <button
          onClick={onRestart}
          className="btn-primary"
        >
          Start Over →
        </button>
      </div>
    </motion.div>
  );
};

export default ImprovementTutor;





