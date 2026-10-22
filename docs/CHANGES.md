# Recent Changes in Khidmat Web App

## 🏗️ Repository Structural Refactoring & Quality Gates
1. **Clean Root Directory**:
   - Created `docs/` and migrated `ARCHITECTURE.md`, `CHANGES.md`, and `PRD.md`.
   - Created `scripts/` and migrated `refactor.cjs`.
   - Ignored `*.mp4` videos in `.gitignore` and removed tracked video binaries from Git cache.
   - Added Demo Video placeholder and documentation links in `README.md`.

2. **Modular Architecture & Types**:
   - Added `src/types/index.ts` declaring centralized TypeScript contracts (`UserProfile`, `Provider`, `Booking`, `ChatMessage`, `TierLevel`, `Category`, `PriceEstimateResult`, etc.).
   - Added `src/constants/index.ts` unifying `PAKISTAN_CITIES`, `TIER_CONFIG`, `CATEGORIES`, and travel pricing constants.
   - Added `src/hooks/` with reusable custom hooks: `useAuth`, `useBookings`, `useProviders`, and `useUserLocation`.

3. **Feature-based Pages Organization & Lazy Loading**:
   - Grouped pages into domain subfolders: `pages/auth/`, `pages/booking/`, `pages/provider/`, and `pages/chat/`.
   - Updated `App.tsx` with `React.lazy` and `Suspense` for asynchronous code splitting and improved initial bundle performance.

4. **Component Decoupling**:
   - Dissected `SharedUI.tsx` into modular UI components under `src/components/ui/` (`Card.tsx`, `EmptyState.tsx`, `Avatar.tsx`, `Button.tsx`, `Input.tsx`).
   - Created `src/components/ui/index.ts` barrel export and safely removed `SharedUI.tsx`.

5. **Production Bundle Optimization for Seed Data**:
   - Moved `seedData.ts` to `scripts/seedData.ts`.
   - Seed invocation in `App.tsx` is now guarded by `import.meta.env.DEV` and dynamic imports so seed payloads never ship to production bundles.

6. **Tailwind CSS v4 & Build Optimization**:
   - Upgraded to the official `@tailwindcss/vite` plugin.
   - Removed obsolete `postcss.config.js`.

7. **Automated Testing & CI Pipeline**:
   - Configured `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`.
   - Added unit test suite covering `ProtectedRoute`, UI rendering, and location calculations.
   - Added `.github/workflows/ci.yml` (lint, build, and test) and updated `auto-merge.yml` with dependency checks.


## AI Agent Widget Enhancements (`SiteAgentWidget.tsx`)

1. **Input Field & Mobile Typing Issues:**
   - Fixed the input field functionality to ensure reliable typing and focus behavior on mobile devices.
   - Removed conflicting drag/resize event listeners from the inner components (such as the messages area and input area) by enforcing `cursor-auto`, preventing them from unintentionally hijacking mobile touches or clicks.

2. **Message Submission Reliability:**
   - Ensured the "Enter" key reliably submits user messages. 
   - Added proper `onKeyDown` handling on the input to capture the 'Enter' key and call `e.preventDefault()` to avoid unintended form submissions or page reloads.

3. **Scroll Behavior with Suggestions:**
   - Perfected the `scrollToBottom` behavior when suggestions are selected. 
   - Ensure the scroll smoothly moves to the bottom of the chat window whenever the `messages` array is updated or when the `isTyping` state changes, ensuring new content is always visible.

4. **UI Structure Adjustments:**
   - Separated the chat logic into a reusable `ChatInner` component to guarantee consistent rendering and behavior between the Desktop draggable/resizable window (`react-rnd`) and the Mobile fullscreen wrapper.
   - Prevented drag events on the close button to fix UX issues when trying to close the widget on desktop.
