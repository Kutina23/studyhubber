# Learning Management System

A modern learning management system built with React, TypeScript, and Supabase.

## Features

- User Authentication (Students and Professors)
- Course Management
- Course Materials Upload and Management
- Student Enrollment System
- Resource Management
- Interactive Forum
- Real-time Updates

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui
  - React Query
  - React Router

- Backend:
  - Supabase (Database, Authentication, Storage)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up Supabase:
   - Create a new project on [Supabase](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── integrations/     # Third-party integrations
├── pages/           # Page components
└── App.tsx          # Main application component
```

## Features in Detail

### Authentication
- Student and Professor registration
- Login/Logout functionality
- Protected routes

### Course Management
- Create and manage courses
- Upload course materials (PDF, Word documents, etc.)
- View enrolled students
- Schedule management

### Student Features
- Course enrollment
- Access to course materials
- Progress tracking
- Forum participation

### Professor Features
- Course creation
- Material upload
- Student management
- Course analytics

## Deployment

1. Build the project:
```bash
npm run build
# or
yarn build
```

2. Deploy to your preferred hosting platform (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.