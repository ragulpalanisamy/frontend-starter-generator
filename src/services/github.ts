import { Octokit } from '@octokit/rest';
import type { Framework, Language } from '@/types';

interface CreateRepoOptions {
  framework: Framework;
  language: Language;
  accessToken: string;
}

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  async createRepository({ framework, language, accessToken: _ }: CreateRepoOptions) {
    try {
      // Get user information
      const { data: _user } = await this.octokit.users.getAuthenticated();

      // Create repository name based on framework and language
      const repoName = `${framework}-${language}-project`;

      // Create new repository
      const { data: repo } = await this.octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: `A ${framework} project with ${language}`,
        private: false,
        auto_init: true
      });

      // Generate project files based on framework and language
      const files = await this.generateProjectFiles(framework, language);

      // Push files to repository
      await this.pushFilesToRepo(repo.full_name, files);

      return repo.html_url;
    } catch (error) {
      console.error('Error creating repository:', error);
      throw error;
    }
  }

  private async generateProjectFiles(framework: Framework, language: Language) {
    const files: Record<string, string> = {};

    // Common files for all projects
    files['README.md'] = this.generateReadme(framework, language);
    files['.gitignore'] = this.generateGitignore();

    // Framework-specific files
    switch (framework) {
      case 'vite':
        files['package.json'] = this.generateVitePackageJson();
        files['vite.config.ts'] = this.generateViteConfig();
        files['tsconfig.json'] = this.generateTypeScriptConfig();
        files['src/main.tsx'] = this.generateViteMainFile();
        files['src/App.tsx'] = this.generateViteAppFile(language);
        files['src/index.css'] = this.generateIndexCSS();
        break;
      case 'nextjs':
        files['package.json'] = this.generateNextjsPackageJson();
        files['next.config.js'] = this.generateNextjsConfig();
        files['tsconfig.json'] = this.generateTypeScriptConfig();
        files['src/app/page.tsx'] = this.generateNextjsPageFile();
        files['src/app/layout.tsx'] = this.generateNextjsLayoutFile();
        files['src/app/globals.css'] = this.generateIndexCSS();
        break;
      case 'cra':
        files['package.json'] = this.generateCRAPackageJson();
        files['src/index.tsx'] = this.generateCRAMainFile();
        files['src/App.tsx'] = this.generateCRAAppFile(language);
        files['src/index.css'] = this.generateIndexCSS();
        break;
    }

    return files;
  }

  private async pushFilesToRepo(repoFullName: string, files: Record<string, string>) {
    // Get the default branch
    const { data: repo } = await this.octokit.repos.get({
      owner: repoFullName.split('/')[0],
      repo: repoFullName.split('/')[1]
    });
    const defaultBranch = repo.default_branch;

    // Get the latest commit SHA
    const { data: ref } = await this.octokit.git.getRef({
      owner: repoFullName.split('/')[0],
      repo: repoFullName.split('/')[1],
      ref: `heads/${defaultBranch}`
    });

    // Create a tree with all files
    const { data: tree } = await this.octokit.git.createTree({
      owner: repoFullName.split('/')[0],
      repo: repoFullName.split('/')[1],
      base_tree: ref.object.sha,
      tree: Object.entries(files).map(([path, content]) => ({
        path,
        content,
        mode: '100644' as const
      }))
    });

    // Create a commit
    const { data: commit } = await this.octokit.git.createCommit({
      owner: repoFullName.split('/')[0],
      repo: repoFullName.split('/')[1],
      message: 'Initial commit with project setup',
      tree: tree.sha,
      parents: [ref.object.sha]
    });

    // Update the reference
    await this.octokit.git.updateRef({
      owner: repoFullName.split('/')[0],
      repo: repoFullName.split('/')[1],
      ref: `heads/${defaultBranch}`,
      sha: commit.sha
    });
  }

  private generateReadme(framework: Framework, language: Language): string {
    return `# ${framework}-${language}-project

This project was generated using the Frontend Starter Generator.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/${framework}-${language}-project.git
cd ${framework}-${language}-project
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
`;
  }

  private generateGitignore(): string {
    return `# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage
*.lcov

# Production
dist
build
out

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
!.vscode/launch.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
*.swp
*.swo
.project
.classpath
.settings/
*.sublime-workspace
*.sublime-project

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Yarn Integrity file
.yarn-integrity

# Vite
vite.config.ts.timestamp-*`;
  }

  private generateVitePackageJson(): string {
    return JSON.stringify({
      name: "vite-project",
      private: true,
      version: "0.1.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "@types/react": "^18.2.64",
        "@types/react-dom": "^18.2.21",
        "@typescript-eslint/eslint-plugin": "^7.1.1",
        "@typescript-eslint/parser": "^7.1.1",
        "@vitejs/plugin-react": "^4.2.1",
        "autoprefixer": "^10.4.18",
        "eslint": "^8.57.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.5",
        "postcss": "^8.4.35",
        "tailwindcss": "^3.4.1",
        "typescript": "^5.2.2",
        "vite": "^5.1.6"
      }
    }, null, 2);
  }

  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});`;
  }

  private generateTypeScriptConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        baseUrl: ".",
        paths: {
          "@/*": ["src/*"]
        }
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }]
    }, null, 2);
  }

  private generateViteMainFile(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }

  private generateViteAppFile(language: Language): string {
    return `import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Vite + React + ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}
        </h1>
      </div>
    </div>
  );
};

export default App;`;
  }

  private generateIndexCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;`;
  }

  private generateNextjsPackageJson(): string {
    return JSON.stringify({
      name: "nextjs-project",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        next: "14.1.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "@types/node": "^20.11.28",
        "@types/react": "^18.2.64",
        "@types/react-dom": "^18.2.21",
        "autoprefixer": "^10.4.18",
        "eslint": "^8.57.0",
        "eslint-config-next": "14.1.0",
        "postcss": "^8.4.35",
        "tailwindcss": "^3.4.1",
        "typescript": "^5.2.2"
      }
    }, null, 2);
  }

  private generateNextjsConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;`;
  }

  private generateNextjsPageFile(): string {
    return `export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js</h1>
    </main>
  );
}`;
  }

  private generateNextjsLayoutFile(): string {
    return `import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Generated with Frontend Starter Generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;
  }

  private generateCRAPackageJson(): string {
    return JSON.stringify({
      name: "cra-project",
      version: "0.1.0",
      private: true,
      dependencies: {
        "@testing-library/jest-dom": "^5.17.0",
        "@testing-library/react": "^13.4.0",
        "@testing-library/user-event": "^13.5.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "5.0.1",
        "web-vitals": "^2.1.4"
      },
      scripts: {
        start: "react-scripts start",
        build: "react-scripts build",
        test: "react-scripts test",
        eject: "react-scripts eject"
      },
      devDependencies: {
        "@types/jest": "^27.5.2",
        "@types/node": "^20.11.28",
        "@types/react": "^18.2.64",
        "@types/react-dom": "^18.2.21",
        "autoprefixer": "^10.4.18",
        "postcss": "^8.4.35",
        "tailwindcss": "^3.4.1",
        "typescript": "^5.2.2"
      },
      eslintConfig: {
        extends: [
          "react-app",
          "react-app/jest"
        ]
      },
      browserslist: {
        production: [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ],
        development: [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
      }
    }, null, 2);
  }

  private generateCRAMainFile(): string {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }

  private generateCRAAppFile(language: Language): string {
    return `import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Create React App + ${language === 'typescript' ? 'TypeScript' : 'JavaScript'}
        </h1>
      </div>
    </div>
  );
};

export default App;`;
  }
} 