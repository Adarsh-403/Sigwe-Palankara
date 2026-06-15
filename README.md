# Sigwe Palankara

This repository contains the Sigwe Palankara project, split into a Node.js/Express backend and a Vite/React frontend.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on default port `27017`)
- Git

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Adarsh-403/Sigwe-Palankara.git
cd Sigwe-Palankara
```

### 2. Backend Setup

The backend is built with Express.js and MongoDB.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   If there is a `.env.example` file, copy it to `.env` and fill in your values. Make sure `MONGO_URI` is correctly pointing to your MongoDB instance (default is usually `mongodb://localhost:27017/sigwe-inventory`).
4. Start the backend server:
   ```bash
   node server.js
   ```
   *The server should now be running on `http://localhost:5000` and connected to MongoDB.*

### 3. Frontend Setup

The frontend is built with React and Vite.

1. Open a new terminal window and navigate to the frontend directory from the project root:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173/Sigwe-Palankara/`.*

## Available Scripts

### Frontend (`/frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run deploy`: Deploys the application to GitHub Pages.

### Backend (`/backend`)
- `node server.js`: Starts the Express server.
