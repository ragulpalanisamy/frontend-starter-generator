# Frontend Starter Generator

A web application that helps you quickly generate frontend projects with your preferred framework and language setup, directly integrated with GitHub.

## Features

- Choose from popular frontend frameworks (Vite, Next.js, Create React App)
- Select your preferred language (TypeScript or JavaScript)
- GitHub OAuth integration for seamless repository creation
- Modern UI with Tailwind CSS
- Full TypeScript support

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- GitHub account
- GitHub OAuth App credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/frontend-starter-generator.git
cd frontend-starter-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your GitHub OAuth credentials:
```env
VITE_GITHUB_CLIENT_ID=your_client_id_here
```

4. Start the development server:
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run preview` - Preview production build

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── constants/      # Constants and configuration
  ├── hooks/          # Custom React hooks
  ├── pages/          # Page components
  ├── services/       # API and external services
  ├── styles/         # Global styles and Tailwind config
  ├── types/          # TypeScript type definitions
  └── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.