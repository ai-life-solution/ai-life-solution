import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Next.js 16 + React 19 + TypeScript용 ESLint 구성입니다.
 */
export default defineConfig([
  // 전역 무시 규칙 - 반드시 가장 먼저 선언합니다.
  {
    ignores: [
      // 빌드 산출물
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',

      // 의존성
      'node_modules/**',

      // 생성된 파일
      'next-env.d.ts',
      '**/*.d.ts',

      // 테스트 및 커버리지 산출물
      'coverage/**',
      '.nyc_output/**',

      // 환경 변수 파일
      '.env*',

      // 패키지 관리자 아티팩트
      'pnpm-lock.yaml',
      'yarn.lock',
      'package-lock.json',
      'bun.lock',

      // 기타 파일
      '.vercel/**',
      'public/**',
      'storybook-static/**',
    ],
  },

  // ESLint 기본 권장 규칙
  js.configs.recommended,

  // TypeScript ESLint 권장 설정
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // TypeScript/React 파일용 주요 설정
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
      import: importPlugin,
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      // ============================================
      // Next.js 전용 규칙
      // ============================================
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // ============================================
      // React 규칙
      // ============================================
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // React 19 최적화
      'react/react-in-jsx-scope': 'off', // React 19에서는 필요하지 않음
      'react/prop-types': 'off', // Prop 검증은 TypeScript가 담당함
      'react/jsx-uses-react': 'off',
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'react/self-closing-comp': 'warn',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],

      // ============================================
      // React Hooks 규칙
      // ============================================
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ============================================
      // TypeScript 규칙
      // ============================================
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      // ============================================
      // Import/Export 규칙
      // ============================================
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'warn',
      'import/no-unresolved': 'off', // 해당 부분은 TypeScript가 처리함

      // ============================================
      // 일반 JavaScript/TypeScript 규칙
      // ============================================
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'quote-props': ['warn', 'as-needed'],
      'prefer-template': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-useless-rename': 'warn',
      'no-duplicate-imports': 'off', // import/no-duplicates 규칙이 대체 처리함
      'no-nested-ternary': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },

  // JavaScript 파일 전용 설정
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // 구성 파일 전용 설정
  {
    files: [
      '*.config.{js,mjs,cjs,ts}',
      'next.config.{js,mjs,ts}',
      'tailwind.config.{js,ts}',
      'postcss.config.{js,mjs}',
    ],
    rules: {
      'import/no-default-export': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },

  // 다른 포매팅 규칙보다 우선하려면 Prettier 설정을 항상 마지막에 배치합니다.
  prettierConfig,
])
