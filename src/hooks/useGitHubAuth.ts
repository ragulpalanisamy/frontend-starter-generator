import { useState, useCallback, useEffect } from 'react';
import { GitHubService } from '@/services/github';
import type { Framework, Language } from '@/types';
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '@/constants';

interface GitHubAuthConfig {
  selectedFramework: Framework | null;
  selectedLanguage: Language | null;
}

export const useGitHubAuth = ({ selectedFramework, selectedLanguage }: GitHubAuthConfig) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGitHubLogin = useCallback(() => {
    if (!selectedFramework || !selectedLanguage) return;

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: 'repo user',
      state: btoa(JSON.stringify({ framework: selectedFramework, language: selectedLanguage }))
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }, [selectedFramework, selectedLanguage]);

  const handleCreateRepository = useCallback(async (accessToken: string) => {
    if (!selectedFramework || !selectedLanguage) return null;

    try {
      setIsLoading(true);
      setError(null);

      const githubService = new GitHubService(accessToken);
      const repoUrl = await githubService.createRepository({
        framework: selectedFramework,
        language: selectedLanguage,
        accessToken
      });

      return repoUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedFramework, selectedLanguage]);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      try {
        // Exchange code for access token using your backend
        const exchangeCodeForToken = async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/github/oauth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code }),
            });

            if (!response.ok) {
              throw new Error('Failed to exchange code for token');
            }

            const { access_token } = await response.json();
            return access_token;
          } catch (err) {
            throw new Error('Failed to authenticate with GitHub');
          }
        };

        exchangeCodeForToken()
          .then(accessToken => handleCreateRepository(accessToken))
          .then(repoUrl => {
            if (repoUrl) {
              // Redirect to the created repository
              window.location.href = repoUrl;
            }
          })
          .catch(err => {
            setError(err instanceof Error ? err.message : 'An error occurred');
          });
      } catch (err) {
        setError('Invalid state parameter');
      }
    }
  }, [handleCreateRepository]);

  return {
    isLoading,
    error,
    handleGitHubLogin,
    handleCreateRepository
  };
}; 