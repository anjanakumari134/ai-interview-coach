# Deployment Guide

## Backend Deployment on Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New+" → "Web Service"
4. Connect repository: `anjanakumari134/ai-interview-coach`
5. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Node.js
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `mongodb+srv://username:password@cluster.mongodb.net/ai-interview-coach`
   - `JWT_SECRET`: `e7690152a917a0ed0d34b54911de15e549b8750d6721ac36547963de3fe9c9d90aee632578f530c73658b3e2126481cbdc76afc6de684d1251044e7733cc79ef`
   - `OPENAI_API_KEY`: `your-openai-api-key`
7. Click "Create Web Service"

## Frontend Deployment on Vercel

1. Go to https://vercel.com
2. Connect repository: `anjanakumari134/ai-interview-coach`
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
5. Click "Deploy"

## Important Notes

- Replace MongoDB URI with your actual MongoDB Atlas connection string
- Replace OpenAI API key with your actual key
- After backend deployment, update frontend VITE_API_URL with actual Render URL
