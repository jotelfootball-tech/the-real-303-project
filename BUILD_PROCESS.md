# Detailed Build & Setup Process

This document provides a comprehensive, step-by-step guide to setting up, building, and running the **NaijaFinder** application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   **Node.js** (Version 14 or higher) - [Download Here](https://nodejs.org/)
*   **npm** (Node Package Manager) - Included with Node.js.
*   **Git** (Optional, for cloning) - [Download Here](https://git-scm.com/)

---

## 🛠️ Step 1: Project Setup

### 1.1. Get the Code
Open your terminal or command prompt and navigate to the directory where you want to store the project.

```bash
# Clone the repository (if using git)
git clone <repository-url>

# OR unpack the project zip file
```

### 1.2. Navigate to Project Directory
```bash
cd lost-and-found-nija
```

### 1.3. Install Dependencies
This project uses `npm` to manage both frontend and backend libraries. Run the following command to download them:

```bash
npm install
```
*   **What this does**: It reads `package.json` and installs all required packages (Express, Multer, Vite, etc.) into the `node_modules` folder.

---

## 🚀 Step 2: Running in Development Mode

For local development, we run both the frontend (Vite) and backend (Express) simultaneously.

### 2.1. Start the Dev Server
```bash
npm run dev
```

### 2.2. Verify Output
You should see output similar to this:
```
[0] Server is running on http://localhost:3000
[1]   VITE v4.x.x  ready in 500 ms
[1]   ➜  Local:   http://localhost:5173/
```

### 2.3. Access the App
Open your web browser and go to:
*   **Frontend**: `http://localhost:5173` (Use this for testing the UI)
*   **Backend API**: `http://localhost:3000/api/items` (For testing raw API data)

> **Note**: The frontend makes API calls to `http://localhost:3000`. Ensure the backend server stays running.

---

## 🏗️ Step 3: Building for Production

When you are ready to deploy, you need to compile the frontend assets.

### 3.1. Create the Build
Run the build script to optimize HTML, CSS, and JavaScript files:

```bash
npm run build
```

*   **Output**: This creates a `dist/` folder containing the minified and optimized production files.

### 3.2. Preview the Production Build
To test the production build locally before deploying:

```bash
npm run preview
```
This spins up a local server serving the `dist/` folder.

---

## 🌐 Step 4: Deployment Guide

### Option A: Deploying to Vercel (Frontend + Serverless)
1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the project root.
3.  Follow the prompts. The `vercel.json` file in the project is already configured to route API requests correctly.

### Option B: Deploying to Render/Heroku (Full Node.js App)
1.  **Build Command**: `npm install && npm run build`
2.  **Start Command**: `node server.js`
3.  **Environment Variables**: ensure `NODE_ENV` is set to `production`.

---

## ⚠️ Troubleshooting Common Issues

### Issue: "Module not found" or "Cannot find module"
*   **Fix**: Run `npm install` again to ensure all dependencies are downloaded.
*   **Fix**: Check if you accidentally deleted `node_modules`.

### Issue: Image Uploads fail
*   **Fix**: Ensure the `uploads/` directory exists in the root (The server should create it automatically).
*   **Fix**: Check permsissions on the folder (Windows typically allows this by default).

### Issue: "Port 3000 is already in use"
*   **Fix**: Another program is using port 3000. Close it or modify `server.js` to use a different port (e.g., `const PORT = process.env.PORT || 4000;`).
