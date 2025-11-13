# Study Club Tracker – Coding Conventions

본 문서는 본 프로젝트의 코딩/네이밍/브랜치/커밋/PR 규칙을 정의합니다.

---

## 컨벤션 요약표

| 주제     | 핵심 규칙                                                                    |
| -------- | ---------------------------------------------------------------------------- |
| 디렉터리 | `src/app/`는 App Router 기준, 컴포넌트는 `src/components/`에 colocation      |
| 네이밍   | 컴포넌트 `PascalCase`, 유틸 `camelCase`, 상수 `UPPER_SNAKE_CASE`             |
| 스타일   | 전역은 `src/style/global.css`, 로컬은 `tailwind`                             |
| 폰트     | `next/font/local`로 `src/app/fonts/` 관리, `src/app/layout.tsx`에서 불러오기 |
| API      | 응답은 `{ success, data?, error? }` 패턴, 상태코드 표준 준수                 |
| Git      | Conventional Commits, `feature/<topic>` 브랜치, 작은 단위 PR                 |

---

## 1. 기본 원칙

- **가독성 우선**: 짧고 명확한 함수/변수명. 주석은 "왜"를 설명.
- **일관성**: 파일 구조, 네이밍, import 경로, 코드 스타일(ESLint/Prettier) 일관 유지.
- **캡슐화**: 컴포넌트와 스타일, 유틸은 가능한 **colocation**.
- **작은 단위 커밋**: 의미 있는 최소 단위로 커밋하고, PR은 작게 유지.

---

## 2. 디렉터리와 파일 구조

- **페이지/라우트**: `app/**/page.tsx`, API는 `app/api/**/route.ts` (Next.js App Router)
- **컴포넌트**: `components/` 하위에 도메인/유형별 디렉터리(`common/`, `ui/`, `forms/` 등)로 구성
- **스타일**: 전역은 `src/style/global.css`, 로컬은 `tailwind`
- **유틸**: `lib/` (예: `lib/utils.ts`, `lib/supabase/*`)
- **문서**: `docs/` (본 파일 포함)

---

## 3. 네이밍 컨벤션

- **파일/폴더**
  - 컴포넌트 파일: `PascalCase` (예: `GoalCard.tsx`)
  - 유틸/훅/라이브러리: `camelCase` (예: `useGoal.ts`, `formatDate.ts`)
  - 페이지 파일: Next 규칙(`page.tsx`, `layout.tsx`, `route.ts`)
  - 테스트 파일(추가 시): `*.test.ts(x)` 또는 `*.spec.ts(x)`
- **변수/함수**: `camelCase` (명확한 동사+명사 조합 권장)
- **타입/인터페이스**: `PascalCase` (예: `StudyGoal`, `TeamMember`)
- **상수**: `UPPER_SNAKE_CASE`
- **환경변수**: 공개 키는 `NEXT_PUBLIC_*`, 서버 전용은 접두사 없이(예: `SUPABASE_SERVICE_ROLE_KEY`)

---

## 4. React/Next.js 규칙

- **서버 컴포넌트 우선**: 기본은 서버 컴포넌트. 브라우저 상호작용이 필요할 때만 상단에 `"use client"` 추가.
- **상태/이펙트 최소화**: 클라이언트 컴포넌트는 꼭 필요한 곳에만.
- **데이터 패칭**: 가능한 서버에서(서버 컴포넌트/Route Handler/Server Action) 수행하고 props로 전달.
- **폰트 관리**: `src/fonts/index.ts`에서 `next/font/local`을 사용해 폰트를 정의하고, 레이아웃에서 `className` 또는 CSS 변수로 적용.
  - 필요한 경우 `fonts.pretendard.className`을 레이아웃 루트에 연결하고, 모듈 CSS에서는 `var(--pretendard)`를 사용합니다.
- **라우팅**: 라우트 그룹 사용 시 `(marketing)`, `(app)` 등으로 **레이아웃 분리**하되 URL에는 반영되지 않음.
- **Route Segment Config**: 점진적 정적 생성(`revalidate`), 동적 렌더링(`dynamic`) 등 설정값은 각 세그먼트의 `page.tsx` 또는 `route.ts`에서 명시적으로 선언합니다.
- **import 경로**: `tsconfig.json`의 `paths`를 이용하여 `@/components/*`, `@/lib/*`, `@/app/*` 절대 경로 사용.

---

## 5. TypeScript

- **엄격 모드 유지** (`strict: true`)
- **명시적 타입**: 공개 API/유틸은 반환 타입 명시 권장
- **유니온/제네릭**: 과도한 복잡화 지양, 필요한 만큼만 사용
- **타입 체크 명령**: `bun typecheck`로 CI와 동일한 `tsc --noEmit` 검사를 수행

---

## 6. 커밋 메시지 (Conventional Commits)

- 형식: `[type] description`
- type 예시: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`
- 예: `[feat] add email sign-in route`

가이드

- **커밋 메세지 + 이슈번호**
  - **[feat]** 새로운 기능 추가 및 변경
  - **[fix]** 버그 수정, 예외 처리 개선
  - **[docs]** 문서 추가/수정 (코드 영향 없음)
  - **[style]** UI 스타일 변경, 코드 포맷 조정 (로직 변경 없음)
  - **[refactor]** 동작은 동일하지만 구조 개선
  - **[test]** 테스트 코드 추가/보완/삭제
  - **[ci]** 빌드·배포 파이프라인 및 린트 설정 수정
  - **[chore]** 패키지 업데이트, 환경 설정 등 기타 작업

- **영문 소문자**, 명령형 현재 시제
- 본문 필요 시 한 줄 띄우고 상세 설명

---

## 7. 브랜치 전략

- 메인 라인: `develop` (또는 `main`)
- 기능 브랜치: `feature/<ticket|topic>`
- 초기화/스캐폴딩: `init/<topic>` (상위 동일명 브랜치 생성 금지 – `init` 단독 브랜치와 충돌 주의)
- 태스크: `task/<topic>`
- 긴급 수정: `hotfix/<desc>`
- 머지 전략: 기능 브랜치는 PR 후 `squash and merge` 기본, 다수 커밋 유지가 필요하면 `rebase and merge` 선택
- 리뷰 기준: 최소 1인 이상 승인, 셀프 머지 금지

예시

```text
feature/progress-endpoint
init/nextjs-setup
```

## 8. 코드 스타일 (ESLint/Prettier)

- 명령어
  - 린트: `bun lint`
  - 포맷: `bun format`
  - 타입 체크: `bun typecheck`
- 콘솔 사용: `eslint.config.mjs`에서 개발 모드는 `console.log` 허용(경고), 프로덕션 빌드에서는 `log` 금지하고 `warn`/`error`만 허용
- 미사용 변수: 경고(가급적 제거). 필요 시 `_` prefix로 무시
- Prettier: `.prettierrc` 기준 `semi: false`, `singleQuote: true`, `trailingComma: 'es5'`, `printWidth: 100`, `arrowParens: 'avoid'`
- ESLint 설정: `eslint.config.mjs`(Flat Config)에서 `next/core-web-vitals` + `prettier` 확장, `@typescript-eslint`, `react-hooks`, `import`, `prettier` 플러그인 사용
