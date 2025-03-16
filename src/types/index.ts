export type Framework = 'vite' | 'nextjs' | 'cra';
export type Language = 'typescript' | 'javascript';

export interface FrameworkOption {
  id: Framework;
  name: string;
  description: string;
}

export interface LanguageOption {
  id: Language;
  name: string;
  description: string;
}

export interface GitHubAuthConfig {
  selectedFramework: Framework | null;
  selectedLanguage: Language | null;
} 