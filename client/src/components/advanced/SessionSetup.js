import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Target, Clock } from 'lucide-react';

const SessionSetup = ({ sessionData, updateSessionData, nextStep }) => {
  const [sessionName, setSessionName] = useState(sessionData.name || '');
  const [sessionDescription, setSessionDescription] = useState(sessionData.description || '');
  const [selectedSubject, setSelectedSubject] = useState(sessionData.subject || '');

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'History', 'Literature', 'Economics', 'Psychology', 'Philosophy',
    'Engineering', 'Medicine', 'Law', 'Business', 'Arts', 'Other'
  ];

  const handleNext = () => {
    if (!sessionName.trim()) {
      return;
    }
    
    updateSessionData({
      name: sessionName.trim(),
      description: sessionDescription.trim(),
      subject: selectedSubject,
      createdAt: new Date().toISOString()
    });
    
    nextStep();
  };

  const isFormValid = sessionName.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Create Your Study Session
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Give your learning journey a name and description. This helps organize your study materials and track your progress.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <div className="space-y-6">
          {/* Session Name */}
          <div>
            <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700 mb-2">
              Session Name *
            </label>
            <input
              type="text"
              id="sessionName"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., Biology Unit 2: Cell Biology, Math Practice: Calculus, History: World War II"
              className="input-field text-lg"
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-1">
              Choose a descriptive name that will help you remember what this session covers.
            </p>
          </div>

          {/* Subject Selection */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject Area
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field"
            >
              <option value="">Select a subject (optional)</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Session Description */}
          <div>
            <label htmlFor="sessionDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="sessionDescription"
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
              placeholder="Describe what you want to learn, any specific topics, or your learning goals..."
              className="input-field"
              rows="4"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {sessionDescription.length}/500 characters
            </p>
          </div>

          {/* Session Preview */}
          {sessionName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Session Preview
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <span className="text-sm text-gray-900 font-semibold">{sessionName}</span>
                </div>
                {selectedSubject && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600">Subject:</span>
                    <span className="text-sm text-gray-900">{selectedSubject}</span>
                  </div>
                )}
                {sessionDescription && (
                  <div className="flex items-start space-x-3">
                    <span className="text-sm font-medium text-gray-600">Description:</span>
                    <span className="text-sm text-gray-900">{sessionDescription}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600">Created:</span>
                  <span className="text-sm text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Button */}
          <div className="pt-6">
            <button
              onClick={handleNext}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>Create Session & Continue</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Pro Tips for Great Sessions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>Use specific names like "Calculus: Derivatives" instead of just "Math"</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>Include the topic or chapter you're studying</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>Add your learning goal or exam date if applicable</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 font-semibold">•</span>
            <span>You can always edit this later in your session settings</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionSetup;





