import React, { useState } from 'react';
import { Github, Code2, CheckCircle, Loader2 } from 'lucide-react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { frameworks, languages } from '@/constants/options';
import type { Framework, Language } from '@/types';

const Home: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { isLoading, error, handleGitHubLogin } = useGitHubAuth({
    selectedFramework,
    selectedLanguage,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFramework || !selectedLanguage) return;
    handleGitHubLogin();
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container px-4 py-16 mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <Code2 className="w-16 h-16 mx-auto mb-4" />
            <h1 className="mb-4 text-4xl font-bold">Project Generator</h1>
            <p className="text-gray-400">Select your preferred framework and language to get started</p>
          </div>

          {error && (
            <div className="p-4 mb-8 text-red-500 border border-red-500 rounded-lg bg-red-500/10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="mb-4 text-xl font-semibold">Choose Framework</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {frameworks.map((framework) => (
                  <button
                    key={framework.id}
                    type="button"
                    onClick={() => setSelectedFramework(framework.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedFramework === framework.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <h3 className="mb-2 font-medium">{framework.name}</h3>
                    <p className="text-sm text-gray-400">{framework.description}</p>
                    {selectedFramework === framework.id && (
                      <CheckCircle className="absolute w-5 h-5 text-blue-500 top-2 right-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="mb-4 text-xl font-semibold">Choose Language</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {languages.map((language) => (
                  <button
                    key={language.id}
                    type="button"
                    onClick={() => setSelectedLanguage(language.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedLanguage === language.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <h3 className="mb-2 font-medium">{language.name}</h3>
                    <p className="text-sm text-gray-400">{language.description}</p>
                    {selectedLanguage === language.id && (
                      <CheckCircle className="absolute w-5 h-5 text-blue-500 top-2 right-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedFramework || !selectedLanguage || isLoading}
              className="flex items-center justify-center w-full gap-2 px-6 py-3 transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              {isLoading ? 'Creating Project...' : 'Continue with GitHub'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home; 