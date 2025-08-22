# StudyGenie Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd studygenie

# Install all dependencies (root, server, and client)
npm run install-all
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your actual values
# See Environment Variables section below
```

### 3. Start Development Servers
```bash
# Start both server and client simultaneously
npm run dev

# Or start them separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

## 🔧 Environment Variables

### Required Variables
- `OPENAI_API_KEY`: Your OpenAI API key for AI tutoring
- `FIREBASE_PROJECT_ID`: Firebase project ID for authentication
- `FIREBASE_PRIVATE_KEY`: Firebase service account private key
- `FIREBASE_CLIENT_EMAIL`: Firebase service account email

### Optional Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `OLLAMA_BASE_URL`: Local Ollama instance URL
- `OPENROUTER_API_KEY`: Alternative LLM provider API key

## 📁 Project Structure

```
studygenie/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── advanced/   # Advanced chat flow components
│   │   │   ├── LandingPage.js
│   │   │   ├── BasicChat.js
│   │   │   └── AdvancedChat.js
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                 # Node.js backend
│   ├── routes/            # API route handlers
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic
│   ├── index.js          # Server entry point
│   └── package.json      # Backend dependencies
├── package.json           # Root package.json (monorepo)
├── README.md             # Project documentation
└── SETUP.md              # This setup guide
```

## 🎯 Features Overview

### Landing Page
- Hero section with compelling messaging
- Feature preview
- About section explaining the tutor workflow

### Basic Chat
- Simple Q&A chatbot interface
- Quick demo of basic functionality

### Advanced Chat (8-Step Flow)
1. **Session Setup**: Name and describe your study session
2. **Source Upload**: Add PDFs, URLs, or text content
3. **Preferences Setup**: Customize learning style and tools
4. **Roadmap Generation**: AI creates personalized learning path
5. **Tutor Chat**: Interactive AI tutoring based on your materials
6. **Interactive Tools**: Mindmaps, quizzes, flashcards, games
7. **Progress Stats**: Learning analytics and performance metrics
8. **Improvement Plan**: Personalized recommendations and next steps

## 🛠️ Development Commands

### Root Level
```bash
npm run dev          # Start both servers
npm run install-all  # Install all dependencies
npm run build        # Build production client
npm start            # Start production server
```

### Server Only
```bash
cd server
npm run dev          # Start with nodemon
npm start            # Start production
npm test             # Run tests
```

### Client Only
```bash
cd client
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Server status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Chat & Learning
- `POST /api/chat/message` - Send chat message
- `POST /api/sessions/create` - Create study session
- `GET /api/sessions/:id` - Get session details

### Content Management
- `POST /api/sources/upload` - Upload study materials
- `POST /api/sources/url` - Process URL content
- `POST /api/roadmap/generate` - Generate learning roadmap

### Tools & Analytics
- `GET /api/tools/mindmap` - Generate mind map
- `GET /api/tools/quiz` - Generate quiz questions
- `GET /api/stats/session/:id` - Get session statistics

## 🎨 UI Components

### Core Components
- **Navbar**: Responsive navigation with mobile menu
- **LandingPage**: Marketing and feature showcase
- **BasicChat**: Simple chatbot interface
- **AdvancedChat**: Multi-step learning flow container

### Advanced Flow Components
- **SessionSetup**: Session creation and configuration
- **SourceUpload**: File and content input management
- **PreferencesSetup**: Learning preferences configuration
- **RoadmapGenerator**: AI-powered learning path creation
- **TutorChat**: Interactive AI tutoring interface
- **LearningTools**: Interactive learning tools (mindmaps, quizzes, etc.)
- **StatsDashboard**: Progress tracking and analytics
- **ImprovementTutor**: Personalized improvement recommendations

## 🚀 Deployment

### Frontend (Client)
```bash
cd client
npm run build
# Deploy the build/ folder to your hosting service
```

### Backend (Server)
```bash
cd server
npm start
# Deploy to your Node.js hosting service
```

### Environment Variables
- Set production environment variables
- Configure production database connections
- Set up proper CORS origins
- Configure rate limiting for production

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Testing
```bash
cd client
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 5000 are available
2. **Environment variables**: Check that all required variables are set
3. **Dependencies**: Run `npm run install-all` if you encounter module errors
4. **CORS issues**: Verify CLIENT_URL in your .env file

### Getting Help
- Check the console for error messages
- Verify all environment variables are set correctly
- Ensure all dependencies are installed
- Check that both servers are running

## 📚 Next Steps

After setup, you can:
1. Customize the UI components and styling
2. Integrate with your preferred AI providers
3. Add authentication and user management
4. Implement database persistence
5. Add more interactive learning tools
6. Deploy to production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Learning with StudyGenie! 🎓✨**





