# Hermes - Inbox Today. Done Tomorrow.

Hermes is a sophisticated email management application that uses AI to turn your emails into calendar events and tasks. Never miss another crucial commitment or opportunity by automating the process of extracting action items from your email inbox.

## Features

- **Email Intelligence**: Connects to major email providers to analyze incoming messages, filter out noise, and extract action items
- **Calendar and Task Management**: Automatically creates events and tasks from your emails with dates, times, and relevant details
- **AI-Powered Action Extraction**: Uses OpenAI models to intelligently parse emails and identify commitments
- **Calendar Sync**: Seamlessly integrates with Google Calendar and other calendar services
- **Quick Capture**: Create tasks or events by speaking or typing
- **Multi-Platform Support**: Access your schedule from any device with a mobile-first responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI**: OpenAI API integration
- **Vector Store**: Supabase Vector extension
- **Authentication**: Supabase Auth with OAuth providers

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hermes.git
   cd hermes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Supabase Setup

Before using the application, you need to set up your Supabase project:

1. Create a new project on [Supabase](https://supabase.com)

2. Run the SQL migrations found in the `supabase/migrations` folder to create the necessary tables and functions

3. Set up authentication providers in your Supabase dashboard (Google, GitHub, etc.)

4. Create storage buckets for user files and application assets

## Development

### Project Structure

```
hermes/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API clients
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Application root component
│   └── main.tsx          # Entry point
├── supabase/
│   └── migrations/       # SQL migrations for Supabase setup
├── .env                  # Environment variables (create this file locally)
└── package.json          # Project dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Deployment

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t hermes-app .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:80 -e VITE_SUPABASE_URL=your-url -e VITE_SUPABASE_ANON_KEY=your-key -e VITE_OPENAI_API_KEY=your-key hermes-app
   ```

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your preferred hosting provider

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com) for AI capabilities
- [Supabase](https://supabase.com) for backend services
- [React](https://reactjs.org) for the UI framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide Icons](https://lucide.dev) for icons