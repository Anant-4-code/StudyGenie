import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Brain, Target, BookOpen, Loader2, Bot, User } from 'lucide-react';
import { apiRequest, ENDPOINTS } from '../../config/api';

const TutorChat = ({ sessionData, updateSessionData, nextStep, prevStep }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello! I'm your AI tutor for "${sessionData.name}". I've analyzed your study materials and created a personalized learning path based on your ${sessionData.preferences.level} level and ${sessionData.preferences.style} learning style. Let's start with the first topic: ${sessionData.roadmap?.topics[0]?.name}. What would you like to know about this topic?`,
      timestamp: new Date(),
      topic: sessionData.roadmap?.topics[0]?.id
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      topic: sessionData.roadmap?.topics[currentTopic]?.id
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      // Create a stable session ID based on the study session
      const sessionId = `tutor-session-${sessionData.name}-${sessionData.roadmap?.topics[currentTopic]?.id || 'general'}`;
      
      // Prepare context for the AI
      const context = {
        topic: sessionData.roadmap?.topics[currentTopic]?.name || 'General Learning',
        learningStyle: sessionData.preferences?.style || 'interactive',
        level: sessionData.preferences?.level || 'beginner',
        sourceMaterial: sessionData.sources?.[0]?.name || 'Study Material'
      };

      // Get the last few messages for context
      const recentMessages = messages.slice(-5).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Call the enhanced chat endpoint
      const data = await apiRequest(ENDPOINTS.AI.CHAT, {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          message: messageContent,
          context,
          messageHistory: recentMessages
        }),
      });
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.reply || 'Sorry, I couldn\'t generate a response. Please try again.',
        timestamp: new Date(),
        topic: sessionData.roadmap?.topics[currentTopic]?.id
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock response if API fails
      const aiResponse = generateAIResponse(messageContent, currentTopic);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput, topicIndex) => {
    const topic = sessionData.roadmap?.topics[topicIndex];
    const { level, style } = sessionData.preferences;
    
    let response = '';
    
    if (level === 'beginner') {
      response = `Great question! Let me explain this in simple terms. ${topic?.name} is a fundamental concept that builds the foundation for more advanced topics. Think of it like building blocks - you need to understand this first before moving forward. Would you like me to provide some examples or break it down further?`;
    } else if (level === 'intermediate') {
      response = `Excellent question! ${topic?.name} involves several interconnected concepts. Let me break this down systematically. The key is understanding how these elements work together. Have you encountered any specific challenges with this topic, or would you like me to elaborate on a particular aspect?`;
    } else {
      response = `That's a sophisticated question about ${topic?.name}. This topic involves complex interactions between multiple systems. Let me provide a comprehensive analysis that covers both the theoretical foundations and practical implications. What specific aspect would you like to explore in more depth?`;
    }

    return {
      id: Date.now() + 1,
      type: 'ai',
      content: response,
      timestamp: new Date(),
      topic: topic?.id
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const nextTopic = () => {
    if (currentTopic < sessionData.roadmap?.topics.length - 1) {
      setCurrentTopic(currentTopic + 1);
      const nextTopicData = sessionData.roadmap.topics[currentTopic + 1];
      
      const topicIntro = {
        id: Date.now(),
        type: 'ai',
        content: `Great progress! Now let's move on to the next topic: ${nextTopicData.name}. This builds upon what we just learned. ${nextTopicData.concepts.join(', ')}. What would you like to explore first?`,
        timestamp: new Date(),
        topic: nextTopicData.id
      };
      
      setMessages(prev => [...prev, topicIntro]);
    }
  };

  const prevTopic = () => {
    if (currentTopic > 0) {
      setCurrentTopic(currentTopic - 1);
    }
  };

  const currentTopicData = sessionData.roadmap?.topics[currentTopic];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your AI Tutoring Session
        </h2>
        <p className="text-xl text-gray-600">
          Learning {sessionData.name} with personalized AI guidance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Panel - Topic Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Learning Topics
            </h3>
            
            <div className="space-y-2">
              {sessionData.roadmap?.topics.map((topic, index) => (
                <button
                  key={topic.id}
                  onClick={() => setCurrentTopic(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    index === currentTopic
                      ? 'bg-blue-100 border border-blue-300 text-blue-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index === currentTopic
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {topic.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{topic.name}</div>
                      <div className="text-xs text-gray-500">{topic.duration}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(((currentTopic + 1) / sessionData.roadmap?.topics.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentTopic + 1) / sessionData.roadmap?.topics.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-4 space-y-2">
              <button
                onClick={prevTopic}
                disabled={currentTopic === 0}
                className="w-full px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous Topic
              </button>
              <button
                onClick={nextTopic}
                disabled={currentTopic === sessionData.roadmap?.topics.length - 1}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next Topic
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Current Topic Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Topic {currentTopic + 1}: {currentTopicData?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentTopicData?.concepts.join(' • ')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Estimated Time</div>
                  <div className="font-semibold text-gray-900">{currentTopicData?.duration}</div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'ai' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-green-500 to-blue-600'
                    }`}>
                      {message.type === 'ai' ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your AI tutor anything about this topic..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="2"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          Previous
        </button>
        
        <button
          onClick={nextStep}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
        >
          <span>Continue to Tools</span>
          <Target className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TutorChat;

