# AI Fitness Coach App

A professional, AI-powered fitness coaching application built with Next.js, TypeScript, and Tailwind CSS. Generate personalized workout and diet plans tailored to your fitness goals.

## Features

### Core Functionality
- **Multi-step Form**: Interactive form with progress indicator for collecting user information
- **AI Plan Generation**: Personalized workout and diet plans powered by OpenAI
- **Workout Plans**: Detailed exercises with sets, reps, and rest times
- **Diet Plans**: Customized meal plans for breakfast, lunch, dinner, and snacks

### Advanced Features
- **Text-to-Speech**: Listen to your workout or diet plan using ElevenLabs API or browser TTS
- **AI Image Generation**: Generate images for exercises and meals using Replicate API
- **PDF Export**: Export your complete fitness plan as a PDF using jsPDF
- **Dark/Light Mode**: Beautiful theme switching with smooth transitions
- **Local Storage**: Automatically saves your plans for easy access
- **Daily Motivational Quotes**: Inspiring quotes to keep you motivated
- **Regenerate Plans**: Generate new plans with a single click

### UI/UX
- Modern, clean interface with gradient backgrounds
- Smooth animations powered by Framer Motion
- Fully responsive design for desktop and mobile
- Professional card-based layout
- Intuitive navigation and user experience

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd ai-fitness-coach
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Add your API keys to `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_REPLICATE_API_KEY=your_replicate_api_key_here
```

**Note**: The app works with mock data if API keys are not provided. Voice functionality will use browser's built-in text-to-speech, and image generation will use placeholder images.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

```
ai-fitness-coach/
│
├── app/                              ← Main Next.js application folder (App Router)
│   ├── page.tsx                      ← The main homepage (shows input form or user plan)
│   ├── layout.tsx                    ← Root layout (navbar, theme toggle, shared layout)
│   │
│   ├── api/                          ← All backend routes (server-side functions)
│   │   ├── plan/route.ts             ← Handles AI plan generation (workout + diet)
│   │   ├── image/generate/route.ts   ← Generates images for exercises and meals using AI
│   │   └── voice/route.ts            ← Uses ElevenLabs API for text-to-speech features
│
├── components/                       ← Reusable UI components (frontend building blocks)
│   ├── ThemeToggle.tsx               ← Dark/Light mode switch button
│   ├── MealCard.tsx                  ← Displays a single meal (image, name, description)
│   ├── WorkoutCard.tsx               ← Displays a single workout exercise
│
├── lib/                              ← Utility functions & API client setups
│   ├── openai.ts                     ← Configures OpenAI API client (for LLM responses)
│   ├── replicate.ts                  ← Handles Replicate API calls (for AI image generation)
│
├── styles/                           ← Global CSS and Tailwind setup
│   ├── globals.css                   ← Base styling, Tailwind directives, custom resets
│
├── tailwind.config.ts                ← Tailwind theme configuration file
├── tsconfig.json                     ← TypeScript compiler settings
├── package.json                      ← Project dependencies and npm scripts
└── .env.local                        ← Private environment variables (API keys, URLs)


## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScpit + Next.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Services**:
  - OpenAI (GPT-4o-mini) for plan generation
  - ElevenLabs for text-to-speech (with browser TTS fallback)
  - Replicate for image generation (with placeholder fallback)
- **PDF Export**: jsPDF + html2canvas
- **Icons**: Lucide React

## Usage

1. **Fill Out the Form**: Complete the multi-step form with your personal information, fitness goals, and preferences.

2. **Generate Your Plan**: Click "Generate Plan" to create your personalized fitness plan.

3. **Explore Your Plan**:
   - View your workout exercises with sets, reps, and rest times
   - Check your daily meal plan
   - Click the image icon to generate AI images for exercises/meals
   - Use the voice button to listen to your plan

4. **Export or Regenerate**:
   - Export your plan as PDF
   - Regenerate a new plan anytime

## API Keys

### OpenAI API Key
- Sign up at [OpenAI Platform](https://platform.openai.com/)
- Get your API key from [API Keys](https://platform.openai.com/api-keys)
- Used for generating personalized fitness plans

### ElevenLabs API Key (Optional)
- Sign up at [ElevenLabs](https://elevenlabs.io/)
- Get your API key from the dashboard
- Used for premium text-to-speech (falls back to browser TTS)

### Replicate API Key (Optional)
- Sign up at [Replicate](https://replicate.com/)
- Get your API key from the account settings
- Used for AI image generation (falls back to placeholder images)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ELEVENLABS_API_KEY=...
NEXT_PUBLIC_REPLICATE_API_KEY=r8_...
```

## Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

This project is open source and available for personal and commercial use.

## Contributing

Contributions, issues, and feature requests are welcome!

## Acknowledgments

- OpenAI for the GPT models
- ElevenLabs for text-to-speech technology
- Replicate for image generation
- Next.js team for the amazing framework