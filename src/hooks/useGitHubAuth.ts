import { useState, useCallback } from 'react';
import { Octokit } from '@octokit/rest';
import type { GitHubAuthConfig } from '@/types';
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '@/constants/options';

export const useGitHubAuth = ({ selectedFramework, selectedLanguage }: GitHubAuthConfig) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGitHubLogin = useCallback(() => {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: 'repo user',
      state: btoa(JSON.stringify({ framework: selectedFramework, language: selectedLanguage }))
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }, [selectedFramework, selectedLanguage]);

  const handleCreateRepository = useCallback(async (accessToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const octokit = new Octokit({ auth: accessToken });

      // Get user information
      const { data: user } = await octokit.users.getAuthenticated();
      console.log(user);

      // Create repository name based on framework and language
      const repoName = `${selectedFramework}-${selectedLanguage}-project`;

      // Create new repository
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: `A ${selectedFramework} project with ${selectedLanguage}`,
        private: false,
        auto_init: true
      });

      return repo.html_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedFramework, selectedLanguage]);

  return {
    isLoading,
    error,
    handleGitHubLogin,
    handleCreateRepository
  };
}; 