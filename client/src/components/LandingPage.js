import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Upload, 
  Brain, 
  Target, 
  Zap,
  BookOpen,
  Users,
  Award,
  Play,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const features = [
    {
      icon: Brain,
      title: 'Personalized AI Tutor',
      description: 'Get customized learning experiences tailored to your style and pace'
    },
    {
      icon: BookOpen,
      title: 'Notes → Learning',
      description: 'Transform any document into interactive study materials instantly'
    },
    {
      icon: Target,
      title: 'Smart Quizzes',
      description: 'AI-generated questions that adapt to your knowledge level'
    },
    {
      icon: Zap,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Upload PDF',
      description: 'Start by uploading your course material, textbook chapter, or any PDF document.',
      visual: '📄'
    },
    {
      step: '2',
      title: 'Extract Text',
      description: 'Our AI intelligently extracts the text and key concepts from your document.',
      visual: '🔍'
    },
    {
      step: '3',
      title: 'Generate Flashcards & Quizzes',
      description: 'Automatically create engaging flashcards and quizzes based on the extracted content.',
      visual: '🎯'
    },
    {
      step: '4',
      title: 'Student Takes Quiz',
      description: 'Test your knowledge with interactive quizzes designed to reinforce learning.',
      visual: '✍️'
    },
    {
      step: '5',
      title: 'Dashboard Updates',
      description: 'Track your progress, identify strengths and weaknesses on your personal dashboard.',
      visual: '📊'
    },
    {
      step: '6',
      title: 'AI Tutor Explains Mistakes',
      description: 'Get instant, clear explanations for any questions you answered incorrectly.',
      visual: '🤖'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Medical Student',
      rating: 5,
      text: 'StudyGenie transformed my study routine. The AI tutor explains complex concepts so clearly!',
      avatar: '👩‍⚕️'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Engineering Student',
      rating: 5,
      text: 'The personalized quizzes are incredible. I actually look forward to studying now.',
      avatar: '👨‍🎓'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Professor',
      rating: 5,
      text: 'I recommend StudyGenie to all my students. It\'s like having a personal tutor 24/7.',
      avatar: '👩‍🏫'
    }
  ];


  const faqs = [
    {
      question: 'How does the AI tutor work?',
      answer: 'Our AI analyzes your study materials and creates personalized learning paths. It adapts to your learning style and provides explanations tailored to your understanding level.'
    },
    {
      question: 'Can I upload any type of document?',
      answer: 'Yes! We support PDFs, Word documents, and even URLs. Our AI can extract and process text from most educational materials.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security and never share your personal information or study materials with third parties.'
    },
    {
      question: 'Can I use StudyGenie on mobile?',
      answer: 'Yes! StudyGenie is fully responsive and works perfectly on all devices - desktop, tablet, and mobile.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              StudyGenie
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto"
            >
              The AI-Powered Tutor That Transforms Your Study Materials Into Interactive Learning Experiences
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/advanced-chat"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg"
              >
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/basic-chat"
                className="inline-flex items-center px-8 py-4 border-2 border-blue-400 text-blue-400 font-semibold rounded-lg hover:bg-blue-400 hover:text-slate-900 transition-colors duration-200 text-lg"
              >
                Try Demo
                <Play className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
          
          {/* Product Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <Brain className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Chat</h3>
                  <p className="text-blue-100">Interactive tutoring conversations</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-xl p-6 text-white">
                  <Target className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Learning Roadmap</h3>
                  <p className="text-green-100">Personalized study paths</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
                  <Zap className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Smart Quizzes</h3>
                  <p className="text-orange-100">Adaptive assessments</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose StudyGenie?</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Experience the future of personalized learning with AI-powered tutoring that adapts to your unique needs
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-700 rounded-xl p-6 border border-slate-600 hover:border-blue-500 transition-colors duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works (User Guide) */}
      <section id="how-it-works" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              See how StudyGenie transforms your documents into interactive learning experiences
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-slate-600 h-full"></div>
            
            <div className="space-y-16">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-900 z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-600">
                      <div className="text-4xl mb-4">{step.visual}</div>
                      <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                      <p className="text-slate-300">{step.description}</p>
                    </div>
                  </div>
                  
                  {/* Step Number */}
                  <div className={`absolute ${index % 2 === 0 ? 'left-1/2 transform -translate-x-1/2 translate-x-8' : 'left-1/2 transform -translate-x-1/2 -translate-x-8'} w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg z-20`}>
                    {step.step}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Demo / Preview */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">See StudyGenie in Action</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Explore the key features that make learning engaging and effective
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-700 rounded-xl p-6 border border-slate-600"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 mb-4">
                <Brain className="w-12 h-12 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Tutor Chat</h3>
              <p className="text-slate-300 mb-4">Interactive conversations with your personal AI tutor</p>
              <Link to="/advanced-chat" className="text-blue-400 hover:text-blue-300 font-medium">
                Try Chat →
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-700 rounded-xl p-6 border border-slate-600"
            >
              <div className="bg-gradient-to-br from-green-500 to-blue-600 rounded-lg p-4 mb-4">
                <Target className="w-12 h-12 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Learning Roadmap</h3>
              <p className="text-slate-300 mb-4">Personalized study paths based on your materials</p>
              <Link to="/advanced-chat" className="text-blue-400 hover:text-blue-300 font-medium">
                View Roadmap →
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-slate-700 rounded-xl p-6 border border-slate-600"
            >
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 mb-4">
                <Zap className="w-12 h-12 text-white mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Quizzes</h3>
              <p className="text-slate-300 mb-4">Adaptive assessments that challenge you perfectly</p>
              <Link to="/advanced-chat" className="text-blue-400 hover:text-blue-300 font-medium">
                Take Quiz →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">What Students & Teachers Say</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Join thousands of learners who have transformed their study experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-600"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-blue-300 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-blue-200">
              Everything you need to know about StudyGenie
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800 rounded-lg border border-slate-600"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-white hover:bg-slate-700 transition-colors duration-200"
                >
                  <span className="font-medium">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-400" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-300">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who are already learning smarter with StudyGenie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/advanced-chat"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
              >
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/basic-chat"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 text-lg"
              >
                Try Free Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">StudyGenie</h3>
              <p className="text-slate-300 mb-6 max-w-md">
                The AI-powered tutor that transforms your study materials into interactive learning experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 StudyGenie. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
