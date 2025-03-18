import { useEffect } from 'react';
import { GitHubService } from '@/services/github';
import type { Framework, Language } from '@/types';

export default function AuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  useEffect(() => {
    if (code && state) {
      try {
        const { framework, language } = JSON.parse(atob(state)) as { framework: Framework; language: Language };
        
        // Exchange code for access token
        fetch(`${import.meta.env.VITE_API_URL}/github/oauth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to exchange code for token');
            }
            return response.json();
          })
          .then(({ access_token }) => {
            // Create repository with the access token
            const githubService = new GitHubService(access_token);
            return githubService.createRepository({
              framework,
              language,
              accessToken: access_token
            });
          })
          .then(repoUrl => {
            if (repoUrl) {
              window.location.href = repoUrl;
            }
          })
          .catch(error => {
            console.error('Error:', error);
            window.location.href = '/?error=' + encodeURIComponent(error.message);
          });
      } catch (error) {
        console.error('Error parsing state:', error);
        window.location.href = '/?error=Invalid state parameter';
      }
    } else {
      window.location.href = '/?error=Missing code or state parameter';
    }
  }, [code, state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Processing GitHub Authentication...
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 