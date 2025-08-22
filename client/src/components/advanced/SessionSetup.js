import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Target, Clock, Upload, Link as LinkIcon, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { apiRequest, ENDPOINTS } from '../config/api';
import toast from 'react-hot-toast';

const SessionSetup = ({ sessionData, updateSessionData, nextStep }) => {
  const [sessionName, setSessionName] = useState(sessionData.name || '');
  const [sessionDescription, setSessionDescription] = useState(sessionData.description || '');
  const [selectedSubject, setSelectedSubject] = useState(sessionData.subject || '');
  
  const [sourceType, setSourceType] = useState('file'); // 'file', 'link', 'text'
  const [sourceFile, setSourceFile] = useState(null);
  const [sourceLink, setSourceLink] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [isProcessingSource, setIsProcessingSource] = useState(false);

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'History', 'Literature', 'Economics', 'Psychology', 'Philosophy',
    'Engineering', 'Medicine', 'Law', 'Business', 'Arts', 'Other'
  ];

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSourceFile(acceptedFiles[0]);
      setSourceLink('');
      setSourceText('');
      setSourceType('file');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md']
    }
  });

  const handleProcessSource = async () => {
    setIsProcessingSource(true);
    let formData = new FormData();
    let endpoint = ENDPOINTS.SOURCES.UPLOAD;
    let hasSource = false;

    if (sourceType === 'file' && sourceFile) {
      formData.append('file', sourceFile);
      hasSource = true;
    } else if (sourceType === 'link' && sourceLink.trim()) {
      formData.append('link', sourceLink.trim());
      hasSource = true;
    } else if (sourceType === 'text' && sourceText.trim()) {
      formData.append('text', sourceText.trim());
      hasSource = true;
    }

    if (!hasSource) {
      toast.error('Please provide a source (file, link, or text) to begin.');
      setIsProcessingSource(false);
      return;
    }

    try {
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: formData,
        isFormData: true // Custom flag for apiRequest to handle FormData headers
      });

      if (response.sessionId && response.initialAIMessage) {
        toast.success('Source processed successfully!');
        updateSessionData({
          sources: [...sessionData.sources, { type: sourceType, content: response.sourceType === 'file' ? sourceFile.name : sourceType }], // Store source info
          sessionId: response.sessionId,
          chatHistory: [{ sender: 'ai', message: response.initialAIMessage, timestamp: new Date().toISOString() }]
        });
        nextStep(); // Move to the next step after source is processed
      } else {
        toast.error(response.error || 'Failed to process source.');
      }
    } catch (error) {
      console.error('Error processing source:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessingSource(false);
    }
  };

  const handleNext = () => {
    if (!sessionName.trim()) {
      toast.error('Session Name is required.');
      return;
    }

    // Now, instead of just calling nextStep, we process the source
    updateSessionData({
        name: sessionName.trim(),
        description: sessionDescription.trim(),
        subject: selectedSubject,
        createdAt: new Date().toISOString()
    });
    
    handleProcessSource();
  };

  const isFormValid = sessionName.trim().length > 0 && (sourceFile || sourceLink.trim() || sourceText.trim());

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
          Create Your Study Session & Add Source
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start your personalized learning journey by naming your session and providing your study material.
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

          {/* Source Input Section */}
          <div className="pt-6 border-t border-gray-100 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Provide Your Learning Source *</h3>
            <p className="text-gray-600 mb-4">
              Upload a file, paste a link, or enter text related to your study session.
            </p>

            <div className="flex space-x-3 mb-6">
              <button
                type="button"
                onClick={() => setSourceType('file')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sourceType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Upload className="w-5 h-5" />
                <span>File Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType('link')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sourceType === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <LinkIcon className="w-5 h-5" />
                <span>Paste Link</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType('text')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sourceType === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Text Input</span>
              </button>
            </div>

            {sourceType === 'file' && (
              <div
                {...getRootProps()}
                className={`dropzone p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                {sourceFile ? (
                  <p className="text-gray-700 font-medium">File selected: {sourceFile.name}</p>
                ) : (
                  <p className="text-gray-500">
                    Drag 'n' drop a file here, or click to select one (PDF, TXT, MD, DOCX)
                  </p>
                )}
              </div>
            )}

            {sourceType === 'link' && (
              <input
                type="url"
                value={sourceLink}
                onChange={(e) => setSourceLink(e.target.value)}
                placeholder="Paste your link here (e.g., https://en.wikipedia.org/wiki/Biology)"
                className="input-field"
              />
            )}

            {sourceType === 'text' && (
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Paste your text here..."
                className="input-field"
                rows="8"
              />
            )}

            {(sourceFile || sourceLink.trim() || sourceText.trim()) && (
              <p className="text-sm text-gray-500 mt-2">
                Selected source type: {sourceType.charAt(0).toUpperCase() + sourceType.slice(1)}
              </p>
            )}
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
              disabled={!isFormValid || isProcessingSource}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                isFormValid && !isProcessingSource
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isProcessingSource ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Source...</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Create Session & Process Source</span>
                </>
              )}
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





