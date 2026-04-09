# Chat App

A full-stack chat application with AI-powered text and image generation, user authentication, credit-based usage, and a community gallery.

## Overview

This project combines a React + Vite frontend with an Express.js backend and MongoDB persistence. Users can register, create conversations, generate AI text and images, purchase credits via Stripe, and view published community-generated images.

## Live Demo

[Live Application](https://chat-web-application-frontend.vercel.app/)

## Key Features

- User authentication with JWT
- AI text generation with Google Gemini
- AI image generation with ImageKit-backed upload
- Credit-based usage model
- Stripe checkout integration for purchasing credits
- Chat session management and history
- Published community image gallery
- Clean React UI with Tailwind and responsive navigation

## Architecture

- `backend/` — Express API server, MongoDB models, Stripe webhook handling, Google Gemini integration, ImageKit image uploads
- `frontend/` — React app built with Vite, client-side routing, authenticated requests, chat UI, credit purchase page, community gallery

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, Stripe, Google GenAI, ImageKit
- Authentication: JWT
- Deployment: Vercel-compatible configuration present for frontend and backend

## Getting Started

### Prerequisites

- Node.js 18+ or later
- npm
- MongoDB database URI
- Google Gemini API key
- ImageKit private key
- Stripe secret key and webhook secret

### Backend Setup

1. Open a terminal and navigate to `backend/`
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file in `backend/` with required values:

```env
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
IMAGEKIT_PRIVATE_KEY=
STRIPE_PUBLISH_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PORT=4000
```

4. Start the backend server in development:

```bash
npm run dev
```

### Frontend Setup

1. Open a terminal and navigate to `frontend/`
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Create a `.env` file at `frontend/` with the backend URL:

```env
VITE_SERVER_URL=http://localhost:4000
```

4. Start the frontend app:

```bash
npm run dev
```

## Available Scripts

### Backend

- `npm run dev` — Start backend in development with nodemon
- `npm start` — Start backend with Node.js

### Frontend

- `npm run dev` — Start Vite development server
- `npm run build` — Build production assets
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## API Endpoints

### User

- `POST /user/register` — Register a new user
- `POST /user/login` — Authenticate and receive a JWT
- `GET /user/profile` — Get authenticated user profile
- `GET /user/published-images` — Fetch community images

### Chat

- `POST /chat/create` — Create a new chat session
- `GET /chat/get` — Retrieve user's chats
- `POST /chat/delete` — Delete a chat session

### Message

- `POST /message/text` — Generate AI text response
- `POST /message/image` — Generate AI image response

### Credits

- `GET /credits/plan` — Get available credit plans
- `POST /credits/purchase` — Create a Stripe checkout session
- `POST /stripe` — Stripe webhook endpoint for purchase fulfillment

## Notes

- The backend currently allows CORS only from the configured production frontend origin. For local development, update the origin in `backend/server.js` or use a local proxy.
- Initial registered users start with default credits managed in the backend user schema.
- Image generation costs 2 credits, while text generation costs 1 credit.

## Deployment

This project includes `vercel.json` in both `backend/` and `frontend/` for production deployments. Ensure environment variables are configured in your Vercel dashboard for each service.

## License

This repository is provided without a specific license. Add a license file if you want to make the source reusable under your chosen terms.
