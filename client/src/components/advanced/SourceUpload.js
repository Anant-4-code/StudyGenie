import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Link as LinkIcon, FileText, X, File, Globe, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SourceUpload = ({ sessionData, updateSessionData, nextStep, prevStep }) => {
  const [sources, setSources] = useState(sessionData.sources || []);
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: 'pdf',
      size: file.size,
      file: file,
      status: 'pending',
      content: null
    }));
    
    setSources(prev => [...prev, ...newFiles]);
    toast.success(`${acceptedFiles.length} file(s) added successfully!`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    const urlSource = {
      id: Date.now(),
      name: urlInput.trim(),
      type: 'url',
      url: urlInput.trim(),
      status: 'pending',
      content: null
    };
    
    setSources(prev => [...prev, urlSource]);
    setUrlInput('');
    toast.success('URL added successfully!');
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    const textSource = {
      id: Date.now(),
      name: 'Custom Text',
      type: 'text',
      content: textInput.trim(),
      status: 'completed',
      size: textInput.length
    };
    
    setSources(prev => [...prev, textSource]);
    setTextInput('');
    toast.success('Text content added successfully!');
  };

  const removeSource = (id) => {
    setSources(prev => prev.filter(source => source.id !== id));
    toast.success('Source removed successfully!');
  };

  const processSources = async () => {
    if (sources.length === 0) {
      toast.error('Please add at least one source before continuing.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update sources with processed status
      const processedSources = sources.map(source => ({
        ...source,
        status: 'completed',
        processedAt: new Date().toISOString()
      }));
      
      setSources(processedSources);
      updateSessionData({ sources: processedSources });
      
      toast.success('All sources processed successfully!');
      nextStep();
    } catch (error) {
      toast.error('Error processing sources. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: 'upload', name: 'Upload Files', icon: Upload, color: 'from-blue-500 to-blue-600' },
    { id: 'url', name: 'Add URLs', icon: Globe, color: 'from-green-500 to-green-600' },
    { id: 'text', name: 'Paste Text', icon: FileText, color: 'from-purple-500 to-purple-600' }
  ];

  const getSourceIcon = (type) => {
    switch (type) {
      case 'pdf': return File;
      case 'url': return Globe;
      case 'text': return FileText;
      default: return File;
    }
  };

  const getSourceStatus = (status) => {
    switch (status) {
      case 'pending': return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Processing...' };
      case 'completed': return { color: 'text-green-600', bg: 'bg-green-100', text: 'Ready' };
      case 'error': return { color: 'text-red-600', bg: 'bg-red-100', text: 'Error' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Unknown' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Upload className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Add Your Study Materials
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload PDFs, add URLs, or paste text content. StudyGenie will analyze these materials to create your personalized learning experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Upload Methods */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-100">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                        isDragActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here'}
                      </p>
                      <p className="text-gray-500 mb-4">
                        or click to browse files
                      </p>
                      <p className="text-sm text-gray-400">
                        Supports PDF files up to 10MB each
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'url' && (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="urlInput" className="block text-sm font-medium text-gray-700 mb-2">
                          Website URL
                        </label>
                        <div className="flex space-x-3">
                          <input
                            type="url"
                            id="urlInput"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/article"
                            className="flex-1 input-field"
                          />
                          <button
                            onClick={handleUrlSubmit}
                            disabled={!urlInput.trim()}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Add URL
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          StudyGenie will extract and analyze the content from the webpage.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'text' && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-2">
                          Text Content
                        </label>
                        <textarea
                          id="textInput"
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                          placeholder="Paste your notes, lecture content, or any text you want to study..."
                          className="input-field"
                          rows="6"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-gray-500">
                            {textInput.length} characters
                          </p>
                          <button
                            onClick={handleTextSubmit}
                            disabled={!textInput.trim()}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Add Text
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Panel - Sources List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Sources ({sources.length})
            </h3>
            
            {sources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No sources added yet</p>
                <p className="text-sm">Add files, URLs, or text to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sources.map((source) => {
                  const status = getSourceStatus(source.status);
                  const SourceIcon = getSourceIcon(source.type);
                  
                  return (
                    <motion.div
                      key={source.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <SourceIcon className="w-5 h-5 text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {source.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bg}`}>
                            <span className={`${status.color}`}>{status.text}</span>
                          </span>
                          {source.size && (
                            <span className="text-xs text-gray-500">
                              {source.type === 'text' 
                                ? `${source.size} chars`
                                : `${(source.size / 1024 / 1024).toFixed(1)} MB`
                              }
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSource(source.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {sources.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={processSources}
                  disabled={isProcessing || sources.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isProcessing || sources.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Process Sources & Continue</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Previous</span>
        </button>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {sources.length} source(s) ready
          </p>
        </div>
      </div>
    </div>
  );
};

export default SourceUpload;





