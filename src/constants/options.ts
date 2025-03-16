import type { FrameworkOption, LanguageOption } from '@/types';

export const frameworks: FrameworkOption[] = [
  {
    id: 'vite',
    name: 'Vite',
    description: 'Lightning fast build tool with instant server start'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'The React framework for production-grade applications'
  },
  {
    id: 'cra',
    name: 'Create React App',
    description: 'Traditional React tooling with zero configuration'
  }
];

export const languages: LanguageOption[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Static typing for scalable applications'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Dynamic and flexible development'
  }
];

// Replace with your GitHub OAuth App client ID
export const GITHUB_CLIENT_ID = process.env.VITE_GITHUB_CLIENT_ID || '';
export const GITHUB_REDIRECT_URI = window.location.origin; 