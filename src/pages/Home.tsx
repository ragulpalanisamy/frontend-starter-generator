import { useState } from 'react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import type { Framework, Language } from '@/types';

const frameworks: { id: Framework; name: string; description: string }[] = [
  {
    id: 'vite',
    name: 'Vite',
    description: 'Next Generation Frontend Tooling'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'The React Framework for Production'
  },
  {
    id: 'cra',
    name: 'Create React App',
    description: 'Set up a modern web app by running one command'
  }
];

const languages: { id: Language; name: string; description: string }[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'JavaScript with syntax for types'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'The language of the web'
  }
];

export default function Home() {
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { isLoading, error, handleGitHubLogin } = useGitHubAuth({
    selectedFramework,
    selectedLanguage
  });

  const handleCreateProject = () => {
    if (selectedFramework && selectedLanguage) {
      handleGitHubLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Frontend Starter Generator
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Create a new frontend project with your favorite framework and language
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Framework Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Framework</h2>
            <div className="space-y-4">
              {frameworks.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => setSelectedFramework(framework.id)}
                  className={`w-full text-left p-4 rounded-lg border ${
                    selectedFramework === framework.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="text-lg font-medium text-gray-900">{framework.name}</h3>
                  <p className="text-sm text-gray-500">{framework.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Language</h2>
            <div className="space-y-4">
              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => setSelectedLanguage(language.id)}
                  className={`w-full text-left p-4 rounded-lg border ${
                    selectedLanguage === language.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="text-lg font-medium text-gray-900">{language.name}</h3>
                  <p className="text-sm text-gray-500">{language.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Project Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleCreateProject}
            disabled={!selectedFramework || !selectedLanguage || isLoading}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              !selectedFramework || !selectedLanguage || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Project...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 