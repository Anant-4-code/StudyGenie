import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, Brain, Clock, CheckCircle, Edit3, Sparkles, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest, ENDPOINTS } from '../../config/api'; // Import API utilities

const RoadmapGenerator = ({ sessionData, updateSessionData, nextStep, prevStep }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(sessionData.roadmap || null);
  const [currentStep, setCurrentStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerateRoadmap = useCallback(async () => {
    setIsGenerating(true);
    setCurrentStep(0);
    setGenerationProgress(0);
    const loadingToast = toast.loading("Generating your personalized roadmap...");

    const steps = [
      'Analyzing your study materials...',
      'Identifying key concepts and topics...',
      'Creating personalized learning path...',
      'Generating interactive elements...',
      'Finalizing your roadmap...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setGenerationProgress(Math.min((i + 1) * 20, 99)); // Cap at 99% before final response
      toast.loading(steps[i], { id: loadingToast });
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate async work
    }

    try {
      const response = await apiRequest(ENDPOINTS.ROADMAP.GENERATE, {
        method: 'POST',
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          topic: sessionData.name,
          description: sessionData.description || '',
          level: sessionData.preferences.level,
          timeframe: sessionData.timeframe || '4 weeks',
          goals: sessionData.goals || [],
          preferences: sessionData.preferences,
        }),
      });

      if (response.roadmap) {
        setRoadmap(response.roadmap);
        updateSessionData({ roadmap: response.roadmap });
        toast.dismiss(loadingToast);
        toast.success('AI-powered roadmap generated successfully!');
      } else {
        throw new Error(response.message || 'Failed to generate roadmap.');
      }
    } catch (error) {
      console.error('Roadmap Generation API Error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to generate roadmap. Using a placeholder.');
      // Fallback to a simpler mock if API fails
      setRoadmap(`## Placeholder Roadmap\n\n**Overview:** Failed to generate a personalized roadmap. Here's a generic structure.\n\n**Modules:**\n- Introduction\n- Core Concepts\n- Advanced Topics\n- Review\n\n**Details:** Check your backend logs for errors related to roadmap generation.`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
  }, [sessionData, updateSessionData]);

  useEffect(() => {
    const initRoadmap = async () => {
      if (isGenerating && !roadmap) {
        await handleGenerateRoadmap(); // Start actual generation
      } else if (roadmap) {
        setIsGenerating(false);
      }
    };
    
    initRoadmap();
  }, [isGenerating, roadmap, handleGenerateRoadmap]);

  const startGeneration = () => {
    setIsGenerating(true);
  };

  const handleNext = () => {
    if (roadmap) {
      updateSessionData({ roadmap });
      nextStep();
    }
  };

  const regenerateRoadmap = () => {
    setRoadmap(null);
    startGeneration();
  };

  const generationSteps = [
    'Analyzing your study materials...',
    'Identifying key concepts and topics...',
    'Creating personalized learning path...',
    'Generating interactive elements...',
    'Finalizing your roadmap...'
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Generate Your Learning Roadmap
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          StudyGenie is analyzing your materials and preferences to create a personalized learning path just for you.
        </p>
      </motion.div>

      {!roadmap && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Generate Your Roadmap
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Based on your {sessionData.sources.length} source(s) and {sessionData.preferences.level} level preferences, 
            I'll create a personalized learning path that matches your {sessionData.preferences.style} learning style.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-medium text-gray-900">{sessionData.sources.length}</div>
              <div className="text-sm text-gray-600">Sources</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-gray-900 capitalize">{sessionData.preferences.level}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-medium text-gray-900">{sessionData.preferences.tools.length}</div>
              <div className="text-sm text-gray-600">Tools</div>
            </div>
          </div>

          <button
            onClick={startGeneration}
            className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate My Roadmap</span>
          </button>
        </motion.div>
      )}

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Creating Your Personalized Roadmap
            </h3>
            <p className="text-gray-600">
              {generationSteps[currentStep]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{generationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${generationProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Generation Steps */}
          <div className="space-y-3">
            {generationSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  index <= currentStep ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                    ? 'bg-blue-500 text-white animate-pulse' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {roadmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Roadmap Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                Your Learning Roadmap
              </h3>
              <button
                onClick={regenerateRoadmap}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{roadmap.topics.length}</div>
                <div className="text-sm text-gray-600">Learning Topics</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{roadmap.estimatedTime}h</div>
                <div className="text-sm text-gray-600">Estimated Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 capitalize">{roadmap.level}</div>
                <div className="text-sm text-gray-600">Difficulty Level</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{roadmap.tools.length}</div>
                <div className="text-sm text-gray-600">Active Tools</div>
              </div>
            </div>
          </div>

          {/* Learning Topics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-6">Learning Topics</h4>
            <div className="space-y-4">
              {roadmap.topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {topic.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-lg font-semibold text-gray-900">{topic.name}</h5>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{topic.duration}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {topic.concepts.map((concept, conceptIndex) => (
                        <div key={conceptIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
              Ready to Start Learning?
            </h4>
            <p className="text-gray-700 mb-4">
              Your personalized roadmap is ready! Click continue to start your learning journey with AI-powered tutoring.
            </p>
            <button
              onClick={handleNext}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      {!isGenerating && (
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Previous
          </button>
          
          {roadmap && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Roadmap generated successfully
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;





