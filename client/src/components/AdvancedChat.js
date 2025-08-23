import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Settings, Brain, Target, Zap } from 'lucide-react';
import SessionSetup from './advanced/SessionSetup';
import PreferencesSetup from './advanced/PreferencesSetup';
import RoadmapGenerator from './advanced/RoadmapGenerator';
import TutorChat from './advanced/TutorChat';
import LearningTools from './advanced/LearningTools';
import StatsDashboard from './advanced/StatsDashboard';
import ImprovementTutor from './advanced/ImprovementTutor';

const AdvancedChat = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionData, setSessionData] = useState({
    name: '',
    sources: [],
    preferences: {
      level: 'beginner',
      style: 'example-based',
      tools: ['mindmap', 'quiz', 'flowchart']
    },
    roadmap: null,
    chatHistory: [],
    stats: {},
    sessionId: null, // Initialize sessionId for advanced chat
  });

  const steps = [
    { id: 1, name: 'Create Session & Add Source', icon: Plus, component: SessionSetup },
    { id: 2, name: 'Set Preferences', icon: Settings, component: PreferencesSetup },
    { id: 3, name: 'Generate Roadmap', icon: Target, component: RoadmapGenerator },
    { id: 4, name: 'Start Learning', icon: Brain, component: TutorChat },
    { id: 5, name: 'Interactive Tools', icon: Zap, component: LearningTools },
    { id: 6, name: 'Progress Stats', icon: Target, component: StatsDashboard },
    { id: 7, name: 'Improvement Plan', icon: Target, component: ImprovementTutor }
  ];

  const updateSessionData = (newData) => {
    setSessionData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const restartSession = () => {
    setCurrentStep(1);
    setSessionData({
      name: '',
      sources: [],
      preferences: {
        level: 'beginner',
        style: 'example-based',
        tools: ['mindmap', 'quiz', 'flowchart']
      },
      roadmap: null,
      chatHistory: [],
      sessionId: null, // Reset sessionId on restart
      stats: {}
    });
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">Advanced Chat</h1>
              <p className="text-sm text-gray-500">Personalized AI Tutoring</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentStep === step.id
                      ? 'bg-blue-100 text-blue-700'
                      : currentStep > step.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{step.name}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {CurrentStepComponent && (
              <CurrentStepComponent
                sessionData={sessionData}
                updateSessionData={updateSessionData}
                nextStep={nextStep}
                prevStep={prevStep}
                onRestart={restartSession}
                currentStep={currentStep}
                totalSteps={steps.length}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      {currentStep > 1 && currentStep < steps.length && (
        <div className="fixed bottom-6 right-6">
          <div className="flex space-x-3">
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedChat;
