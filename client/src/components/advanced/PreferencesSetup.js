import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Brain, Target, Zap, CheckCircle } from 'lucide-react';

const PreferencesSetup = ({ sessionData, updateSessionData, nextStep, prevStep }) => {
  const [preferences, setPreferences] = useState({
    level: sessionData.preferences?.level || 'beginner',
    style: sessionData.preferences?.style || 'example-based',
    tools: sessionData.preferences?.tools || ['mindmap', 'quiz'],
    pace: sessionData.preferences?.pace || 'moderate',
    focus: sessionData.preferences?.focus || 'comprehensive'
  });

  const learningLevels = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'New to the topic, need step-by-step explanations',
      icon: '🌱',
      features: ['Simple explanations', 'Basic examples', 'Foundation concepts', 'Frequent reviews']
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Some knowledge, want to deepen understanding',
      icon: '🚀',
      features: ['Balanced theory & practice', 'Real-world applications', 'Problem-solving focus', 'Moderate complexity']
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Strong foundation, seeking in-depth knowledge',
      icon: '🎯',
      features: ['Complex concepts', 'Advanced problem-solving', 'Research-level insights', 'Minimal repetition']
    }
  ];

  const teachingStyles = [
    {
      id: 'example-based',
      name: 'Example-Based',
      description: 'Learn through practical examples and real-world scenarios',
      icon: '💡'
    },
    {
      id: 'theory-heavy',
      name: 'Theory-Heavy',
      description: 'Focus on concepts, definitions, and theoretical foundations',
      icon: '📚'
    },
    {
      id: 'exam-prep',
      name: 'Exam Preparation',
      description: 'Structured learning with practice questions and test strategies',
      icon: '📝'
    },
    {
      id: 'conversational',
      name: 'Conversational',
      description: 'Casual, discussion-based learning with interactive dialogue',
      icon: '💬'
    }
  ];

  const availableTools = [
    { id: 'mindmap', name: 'Mindmaps', description: 'Visual concept connections', icon: '🧠' },
    { id: 'flowchart', name: 'Flowcharts', description: 'Process and algorithm visualization', icon: '🔀' },
    { id: 'quiz', name: 'Quizzes', description: 'Multiple choice and descriptive questions', icon: '❓' },
    { id: 'rapid-fire', name: 'Rapid Fire', description: 'Quick practice sessions', icon: '⚡' },
    { id: 'game-mode', name: 'Game Mode', description: 'Fun learning with points and achievements', icon: '🎮' },
    { id: 'flashcards', name: 'Flashcards', description: 'Memory reinforcement cards', icon: '🃏' }
  ];

  const learningPaces = [
    { id: 'slow', name: 'Slow & Steady', description: 'Take time to absorb concepts' },
    { id: 'moderate', name: 'Moderate', description: 'Balanced pace for most learners' },
    { id: 'fast', name: 'Fast Track', description: 'Quick progression through material' }
  ];

  const learningFocus = [
    { id: 'comprehensive', name: 'Comprehensive', description: 'Cover all aspects thoroughly' },
    { id: 'key-concepts', name: 'Key Concepts', description: 'Focus on main ideas and principles' },
    { id: 'practical', name: 'Practical', description: 'Emphasize real-world applications' },
    { id: 'exam-focused', name: 'Exam Focused', description: 'Target specific exam requirements' }
  ];

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleTool = (toolId) => {
    setPreferences(prev => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter(id => id !== toolId)
        : [...prev.tools, toolId]
    }));
  };

  const handleNext = () => {
    if (preferences.tools.length === 0) {
      return;
    }
    
    updateSessionData({ preferences });
    nextStep();
  };

  const isFormValid = preferences.tools.length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Customize Your Learning Experience
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Set your learning preferences to get the most personalized tutoring experience. StudyGenie will adapt its teaching style and tools to match your needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Learning Level */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Learning Level
            </h3>
            <div className="space-y-3">
              {learningLevels.map((level) => (
                <label
                  key={level.id}
                  className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    preferences.level === level.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="level"
                    value={level.id}
                    checked={preferences.level === level.id}
                    onChange={(e) => updatePreference('level', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{level.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{level.name}</span>
                        {preferences.level === level.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                      <div className="mt-2 space-y-1">
                        {level.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Teaching Style */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Teaching Style
            </h3>
            <div className="space-y-3">
              {teachingStyles.map((style) => (
                <label
                  key={style.id}
                  className={`relative flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    preferences.style === style.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="style"
                    value={style.id}
                    checked={preferences.style === style.id}
                    onChange={(e) => updatePreference('style', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{style.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{style.name}</span>
                        {preferences.style === style.id && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Learning Tools */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-600" />
              Learning Tools
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select the tools you'd like to use during your learning sessions. You can change these later.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableTools.map((tool) => (
                <label
                  key={tool.id}
                  className={`relative flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    preferences.tools.includes(tool.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={preferences.tools.includes(tool.id)}
                    onChange={() => toggleTool(tool.id)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{tool.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                        {preferences.tools.includes(tool.id) && (
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Additional Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Learning Pace */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Learning Pace</h4>
              <div className="space-y-2">
                {learningPaces.map((pace) => (
                  <label
                    key={pace.id}
                    className={`relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      preferences.pace === pace.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pace"
                      value={pace.id}
                      checked={preferences.pace === pace.id}
                      onChange={(e) => updatePreference('pace', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{pace.name}</span>
                      {preferences.pace === pace.id && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 ml-3">{pace.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Learning Focus */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Learning Focus</h4>
              <div className="space-y-2">
                {learningFocus.map((focus) => (
                  <label
                    key={focus.id}
                    className={`relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      preferences.focus === focus.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="focus"
                      value={focus.id}
                      checked={preferences.focus === focus.id}
                      onChange={(e) => updatePreference('focus', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{focus.name}</span>
                      {preferences.focus === focus.id && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 ml-3">{focus.description}</p>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preferences Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
          Your Learning Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Level:</span>
            <span className="ml-2 text-gray-900 capitalize">{preferences.level}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Style:</span>
            <span className="ml-2 text-gray-900 capitalize">{preferences.style.replace('-', ' ')}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Pace:</span>
            <span className="ml-2 text-gray-900 capitalize">{preferences.pace}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Focus:</span>
            <span className="ml-2 text-gray-900 capitalize">{preferences.focus.replace('-', ' ')}</span>
          </div>
        </div>
        <div className="mt-3">
          <span className="font-medium text-gray-600">Tools:</span>
          <span className="ml-2 text-gray-900">
            {preferences.tools.map(tool => availableTools.find(t => t.id === tool)?.name).join(', ')}
          </span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
            isFormValid
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Generate Roadmap</span>
          <Target className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PreferencesSetup;





