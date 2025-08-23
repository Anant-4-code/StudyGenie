import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, Loader2, UploadCloud, Link as LinkIcon, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiRequest, ENDPOINTS } from '../config/api';
import { useDropzone } from 'react-dropzone';

const BasicChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI tutor. I'm here to help you with any questions you might have. First, please provide a learning source: a file, a link, or raw text.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourceProvided, setSourceProvided] = useState(false);
  const [sourceType, setSourceType] = useState(null); // 'file', 'link', 'text'
  const [sourceFile, setSourceFile] = useState(null);
  const [sourceLink, setSourceLink] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [isProcessingSource, setIsProcessingSource] = useState(false);
  const [sessionId, setSessionId] = useState(null); // To store session ID after source upload
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSourceFile(acceptedFiles[0]);
      toast.success(`File selected: ${acceptedFiles[0].name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await apiRequest(ENDPOINTS.CHAT.MESSAGE, {
        method: 'POST',
        body: JSON.stringify({
          message: messageContent,
          sessionId: sessionId // Use the stored sessionId
        }),
      });
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.reply || 'Sorry, I couldn\'t generate a response. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock response if API fails
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I couldn\'t generate a response. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      toast.error('Using offline mode. Start the server for full AI features.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProcessSource = async () => {
    if (!sourceType || isProcessingSource) return;

    setIsProcessingSource(true);
    toast.loading('Processing your source...');

    const formData = new FormData();
    let endpoint = '';
    let sourceContent = '';

    try {
      if (sourceType === 'file' && sourceFile) {
        formData.append('sourceType', 'file');
        formData.append('file', sourceFile);
        endpoint = ENDPOINTS.SOURCES.UPLOAD;
      } else if (sourceType === 'link' && sourceLink.trim()) {
        formData.append('sourceType', 'link');
        formData.append('link', sourceLink.trim());
        endpoint = ENDPOINTS.SOURCES.UPLOAD;
        sourceContent = sourceLink.trim();
      } else if (sourceType === 'text' && sourceText.trim()) {
        formData.append('sourceType', 'text');
        formData.append('text', sourceText.trim());
        endpoint = ENDPOINTS.SOURCES.UPLOAD;
        sourceContent = sourceText.trim();
      } else {
        toast.error('Please provide a valid source input.');
        setIsProcessingSource(false);
        return;
      }

      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: formData,
        isFormData: true, // Custom flag to inform apiRequest not to set Content-Type header
      });

      if (data.sessionId) {
        setSessionId(data.sessionId);
        setSourceProvided(true);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 2,
            type: 'ai',
            content: `Great! I've processed your ${sourceType}. What questions do you have about it?`,
            timestamp: new Date()
          }
        ]);
        toast.dismiss();
        toast.success('Source processed successfully! You can now ask questions.');
      } else {
        throw new Error(data.message || 'Failed to process source.');
      }
    } catch (error) {
      console.error('Source processing error:', error);
      toast.dismiss();
      toast.error(error.message || 'Failed to process source. Please try again.');
    } finally {
      setIsProcessingSource(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-900">Basic Chat</h1>
              <p className="text-sm text-gray-500">Quick AI-powered Q&A</p>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!sourceProvided ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900">Provide Your Learning Source</h2>
            <p className="text-gray-600">To begin, please upload a file, paste a link, or enter text.</p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setSourceType('file')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200
                  ${sourceType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                <UploadCloud className="w-5 h-5" />
                <span>File Upload</span>
              </button>
              <button
                onClick={() => setSourceType('link')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200
                  ${sourceType === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                <LinkIcon className="w-5 h-5" />
                <span>Paste Link</span>
              </button>
              <button
                onClick={() => setSourceType('text')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200
                  ${sourceType === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                <FileText className="w-5 h-5" />
                <span>Text Input</span>
              </button>
            </div>

            {sourceType === 'file' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:border-blue-500 transition-colors duration-200"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the file here ...</p>
                ) : (
                  <p className="text-gray-500">Drag 'n' drop a file here, or click to select one (PDF, TXT, MD, DOCX)</p>
                )}
                {sourceFile && (
                  <p className="mt-2 text-sm text-gray-700">Selected file: <span className="font-medium">{sourceFile.name}</span></p>
                )}
              </motion.div>
            )}

            {sourceType === 'link' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <input
                  type="url"
                  placeholder="Paste your link here (e.g., https://example.com/article)"
                  value={sourceLink}
                  onChange={(e) => setSourceLink(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </motion.div>
            )}

            {sourceType === 'text' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <textarea
                  placeholder="Paste your text here..."
                  rows="8"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                ></textarea>
              </motion.div>
            )}

            {(sourceType === 'file' && sourceFile) ||
             (sourceType === 'link' && sourceLink.trim()) ||
             (sourceType === 'text' && sourceText.trim()) ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleProcessSource}
                disabled={isProcessingSource}
                className="mt-6 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
              >
                {isProcessingSource ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
                <span>{isProcessingSource ? 'Processing...' : 'Process Source'}</span>
              </motion.button>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Chat Messages */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-4">
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
                    placeholder="Ask me anything about the source... (Press Enter to send, Shift+Enter for new line)"
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
              
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  💡 This is basic chat mode. For personalized tutoring with your own materials, 
                  try <Link to="/advanced-chat" className="text-blue-600 hover:underline">Advanced Chat</Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BasicChat;

