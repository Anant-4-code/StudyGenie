import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Star
} from 'lucide-react';

const StatsDashboard = ({ sessionData, onNext, onBack }) => {
  const [stats, setStats] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('session');
  const [selectedMetric, setSelectedMetric] = useState('progress');

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        sessionStats: {
          duration: '45 minutes',
          topicsCovered: 3,
          questionsAnswered: 12,
          correctAnswers: 10,
          accuracy: 83.3,
          timePerTopic: '15 minutes'
        },
        learningProgress: {
          overall: 75,
          concepts: 80,
          application: 70,
          retention: 85
        },
        performanceMetrics: {
          quizScores: [85, 90, 75, 88, 92],
          timeSpent: [12, 15, 18, 10, 14],
          improvementRate: 15.2
        },
        achievements: [
          { name: 'First Steps', description: 'Completed first learning session', icon: '🎯', unlocked: true },
          { name: 'Quick Learner', description: 'Answered 10+ questions correctly', icon: '⚡', unlocked: true },
          { name: 'Consistent', description: 'Maintained 80%+ accuracy', icon: '📈', unlocked: true },
          { name: 'Master', description: 'Achieve 95%+ accuracy', icon: '👑', unlocked: false }
        ]
      });
    }, 1000);
  }, []);

  const timeframes = [
    { id: 'session', label: 'This Session', icon: Clock },
    { id: 'week', label: 'This Week', icon: Calendar },
    { id: 'month', label: 'This Month', icon: BarChart3 }
  ];

  const metrics = [
    { id: 'progress', label: 'Learning Progress', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  const renderProgressChart = () => {
    const { learningProgress } = stats;
    const categories = ['Overall', 'Concepts', 'Application', 'Retention'];
    const values = [learningProgress.overall, learningProgress.concepts, learningProgress.application, learningProgress.retention];
    
    return (
      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{category}</span>
              <span className="text-sm font-semibold text-blue-600">{values[index]}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${values[index]}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPerformanceChart = () => {
    const { performanceMetrics } = stats;
    const maxScore = Math.max(...performanceMetrics.quizScores);
    const maxTime = Math.max(...performanceMetrics.timeSpent);
    
    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">Quiz Performance Over Time</h4>
          <div className="flex items-end justify-between h-32">
            {performanceMetrics.quizScores.map((score, index) => (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(score / maxScore) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="w-8 bg-gradient-to-t from-green-500 to-blue-500 rounded-t-lg"
                />
                <span className="text-xs text-gray-600 mt-2">{score}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Improvement Rate</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">+{performanceMetrics.improvementRate}%</span>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Avg Time</span>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {Math.round(performanceMetrics.timeSpent.reduce((a, b) => a + b, 0) / performanceMetrics.timeSpent.length)}m
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${achievement.unlocked ? 'opacity-100' : 'opacity-30'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderSessionSummary = () => {
    const { sessionStats } = stats;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="text-2xl font-bold text-gray-900">{sessionStats.duration}</div>
          <div className="text-sm text-gray-600">Session Duration</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-gray-900">{sessionStats.topicsCovered}</div>
          <div className="text-sm text-gray-600">Topics Covered</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="text-2xl font-bold text-gray-900">{sessionStats.accuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <div className="text-2xl font-bold text-gray-900">{sessionStats.correctAnswers}</div>
          <div className="text-sm text-gray-600">Correct Answers</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border text-center">
          <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
          <div className="text-2xl font-bold text-gray-900">
            {sessionStats.questionsAnswered - sessionStats.correctAnswers}
          </div>
          <div className="text-sm text-gray-600">Incorrect</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border text-center">
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
          <div className="text-2xl font-bold text-gray-900">{sessionStats.timePerTopic}</div>
          <div className="text-sm text-gray-600">Per Topic</div>
        </div>
      </div>
    );
  };

  if (!stats) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning statistics...</p>
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
          Learning Analytics Dashboard
        </h2>
        <p className="text-lg text-gray-600">
          Track your progress and performance in {sessionData.subject}
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.id}
              onClick={() => setSelectedTimeframe(timeframe.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                selectedTimeframe === timeframe.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <timeframe.icon className="w-4 h-4" />
              {timeframe.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session Summary */}
      {selectedTimeframe === 'session' && renderSessionSummary()}

      {/* Metric Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                selectedMetric === metric.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <metric.icon className="w-4 h-4" />
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Content */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        {selectedMetric === 'progress' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Learning Progress Breakdown</h3>
            {renderProgressChart()}
          </div>
        )}
        
        {selectedMetric === 'performance' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Performance Analytics</h3>
            {renderPerformanceChart()}
          </div>
        )}
        
        {selectedMetric === 'achievements' && (
          <div>
            <h3 className="text-xl font-semibold mb-6">Achievements & Milestones</h3>
            {renderAchievements()}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Learning Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Focus Areas</h4>
            <p className="text-sm text-gray-600">
              Based on your performance, focus on application concepts where you scored 70%.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
            <p className="text-sm text-gray-600">
              Try the advanced quiz mode to challenge yourself and improve retention.
            </p>
          </div>
        </div>
      </div>

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

export default StatsDashboard;





