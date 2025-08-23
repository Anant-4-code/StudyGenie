import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, UploadCloud, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { apiRequest } from '../config/api';
import toast from 'react-hot-toast';

const BasicChatV2 = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI assistant. You can ask me anything or upload a file for me to analyze.",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      toast.success(`File ready: ${acceptedFiles[0].name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !file) || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      ...(file && { file: file.name })
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setFile(null);
    setIsLoading(true);

    try {
      // Prepare the request data
      const formData = new FormData();
      formData.append('message', inputValue);
      
      if (file) {
        formData.append('file', file);
      }

      // Use the new chat/v2/basic endpoint
      const response = await apiRequest('/api/v1/chat/v2/basic', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with the correct boundary
        headers: {
          'Accept': 'application/json'
        }
      });

      // Process the structured response
      if (response.data) {
        const aiMessages = [];
        
        // Add summary if available
        if (response.data.response) {
          aiMessages.push({
            id: Date.now() + 1,
            type: 'ai',
            content: response.data.response,
            timestamp: new Date()
          });
        }

        // Add key points if available
        if (response.data.keyPoints?.length > 0) {
          aiMessages.push({
            id: Date.now() + 2,
            type: 'ai',
            content: '**Key Points:**\n' + response.data.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n'),
            timestamp: new Date()
          });
        }

        // Add flashcards if available
        if (response.data.flashcards?.length > 0) {
          aiMessages.push({
            id: Date.now() + 3,
            type: 'ai',
            content: '**Flashcards Created:**\n' + 
              response.data.flashcards.map((card, i) => 
                `**Q${i + 1}:** ${card.question}\n**A${i + 1}:** ${card.answer}`
              ).join('\n\n'),
            timestamp: new Date()
          });
        }

        // Add quiz if available
        if (response.data.quiz?.length > 0) {
          aiMessages.push({
            id: Date.now() + 4,
            type: 'ai',
            content: '**Quiz Questions:**\n' + 
              response.data.quiz.map((q, i) => 
                `**Q${i + 1}:** ${q.question}\n` +
                q.options.map((opt, j) => 
                  `${String.fromCharCode(97 + j)}) ${opt}${j === q.correctIndex ? ' (Correct)' : ''}`
                ).join('\n')
              ).join('\n\n'),
            timestamp: new Date()
          });
        }

        setMessages(prev => [...prev, ...aiMessages]);
      } else {
        // Fallback for unexpected response format
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            type: 'ai',
            content: 'I received your message but encountered an issue processing it.',
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 py-4 px-6">
        <h1 className="text-xl font-semibold text-gray-900">Basic Chat</h1>
        <p className="text-sm text-gray-500">Ask anything or upload a file for analysis</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3/4 rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : message.isError
                  ? 'bg-red-100 text-red-800 rounded-tl-none border border-red-200'
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-200'
              }`}
            >
              {message.content}
              {message.file && (
                <div className="mt-2 p-2 bg-black bg-opacity-10 rounded text-sm">
                  <div className="flex items-center">
                    {message.file.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 mr-2" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    <span className="truncate">{message.file.name}</span>
                    <span className="ml-2 text-xs opacity-70">
                      {(message.file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>
              )}
              <div className="text-xs opacity-70 mt-1 text-right">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        {/* File preview */}
        {file && (
          <div className="relative bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="w-5 h-5 text-blue-600 mr-2" />
                ) : (
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                )}
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input and buttons */}
        <div className="flex items-end space-x-2">
          <div
            {...getRootProps()}
            className={`flex-shrink-0 p-2 rounded-full cursor-pointer ${
              isDragActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            } transition-colors`}
            title="Upload file"
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full border border-gray-300 rounded-lg py-2 px-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputValue.trim() && !file)}
              className={`absolute right-2 bottom-2 p-1 rounded-full ${
                (inputValue.trim() || file)
                  ? 'text-blue-600 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
              } transition-colors`}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicChatV2;
