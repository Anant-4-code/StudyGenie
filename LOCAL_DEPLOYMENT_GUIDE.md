# 🚀 StudyGenie Local Deployment Guide

## Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Quick Setup

### 1. Fix PowerShell Execution Policy (Windows)
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Go back to root
cd ..
```

### 3. Environment Configuration

**Create `server/.env`:**
```env
PORT=5000
OPENAI_API_KEY=your_openai_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
FIREBASE_CONFIG=your_firebase_config_here
```

**Create `client/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_CONFIG=your_firebase_config_here
```

### 4. Start the Application

**Option 1: Start both servers together (Recommended)**
```bash
npm run dev
```

**Option 2: Start servers separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Troubleshooting

### PowerShell Issues
If you still get execution policy errors:
```bash
# Use npx instead
npx concurrently "npm run server" "npm run client"
```

### Port Conflicts
If ports are busy, update the PORT in `server/.env` and `REACT_APP_API_URL` in `client/.env`

### Missing Dependencies
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Next Steps

1. **Configure API Keys**: Add your OpenAI/OpenRouter keys to `server/.env`
2. **Setup Firebase**: Configure Firebase for user authentication and data storage
3. **Test Features**: Try both Basic Chat and Advanced Chat modes
4. **Upload Materials**: Test PDF uploads and URL content extraction

## 📱 Features to Test

- ✅ Basic Chat Mode
- ✅ Advanced Chat with file uploads
- ✅ AI Roadmap Generator
- ✅ Interactive Learning Tools
- ✅ Progress Tracking

---

**🎉 Your StudyGenie AI Tutor is ready to help students learn smarter!**
