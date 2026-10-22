# Khidmat (خدمت) — On-Demand Home Services Marketplace

> **1-Line Pitch**: Pakistan's dual-role home services marketplace powered by Google Gemma 4 (`gemma-4-26b-a4b-it`) open-weight AI for natural-language intent parsing, proximity ranking, and fair PKR price estimation.

---

## 📸 Interface Preview

| Hero & Voice Search | 21 Service Categories Grid | Why Khidmat & Verification |
|:---:|:---:|:---:|
| ![Hero Search Banner](./docs/assets/hero_banner.png) | ![Explore Categories](./docs/assets/categories_grid.png) | ![Why We Created Khidmat](./docs/assets/why_khidmat.png) |

---

## 🎯 Core Value & Focus
* **Dual-Profile Marketplace**: Single account allows users to switch seamlessly between **Customer** (hire services) and **Provider** (receive jobs & track earnings).
* **Gemma 4 AI Engine**: Direct integration with Google's open-weight `gemma-4-26b-a4b-it` (Apache 2.0) via Google Generative Language REST endpoints.
* **100% Fail-Proof**: Resilient client-side **Local Fallback Parser** kicks in under 10ms if network drops, ensuring zero demo failures.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Customer / Service Provider]) -->|Role Switcher| Router{React Router v6}
    
    subgraph Client Application [React 19 + TypeScript + Vite 8]
        Router -->|role = customer| CustomerPortal[Customer Marketplace Portal]
        Router -->|role = provider| ProviderPortal[Provider Dashboard & Job Feed]
        
        CustomerPortal -->|Voice / Text Intent| AIMatcher[AI Matching Engine]
        CustomerPortal -->|GPS Location| GeoModule[Haversine Proximity Engine]
        ProviderPortal -->|Live Status| Beacon[Online / Offline Beacon]
    end

    subgraph Intelligence Layer [Google Gemma 4 AI]
        AIMatcher -->|REST API v1beta| Gemma4[Google Gemma 4: gemma-4-26b-a4b-it]
        Gemma4 -.->|Quota Limit / Timeout| Fallback[Local Fallback Matrix <10ms]
        Gemma4 -->|Structured JSON| IntentResult[Category + Urgency + Fair PKR Price]
        Fallback -->|Regex Match| IntentResult
    end

    subgraph Backend Infrastructure [Serverless BaaS]
        IntentResult --> Firestore[(Google Cloud Firestore)]
        ProviderPortal --> Firestore
        Beacon --> Firestore
        CustomerPortal --> Auth[(Firebase Auth)]
    end
```

---

## 📁 Directory Structure

```text
khidmat_web_app-main/
├── .github/workflows/          # CI/CD Automated Pipelines
├── docs/                       # Project Documentation & Screenshots
│   └── assets/                 # UI Screenshots for README
├── scripts/                    # Development & Seed Utilities
│   └── seedData.ts             # 21-category localized mock database
├── src/
│   ├── components/             # UI atomic primitives, auth guards & widgets
│   ├── contexts/               # AuthContext & Dual-Role Session Management
│   ├── hooks/                  # Custom hooks (useAuth, useBookings, useProviders, useUserLocation)
│   ├── layouts/                # Navbar (with Role Switcher), Footer, BottomNav
│   ├── pages/
│   │   ├── auth/               # Authentication (Customer / Provider registration)
│   │   ├── booking/            # ConfirmBooking.tsx, MyBookings.tsx
│   │   ├── chat/               # Real-time Chat & Inbox
│   │   ├── provider/           # ProviderHome (Dashboard), ProviderList, ProviderProfile
│   │   ├── AIMatching.tsx      # Voice scanning radar & Gemma 4 matching
│   │   ├── Home.tsx            # Dynamic Root (CustomerHome vs ProviderHome)
│   │   └── Profile.tsx         # User Profile & Dual-Profile Switcher Card
│   ├── services/
│   │   ├── firebase.ts         # Firestore, Auth, and fallback LocalStorage DB
│   │   └── gemini.ts           # Google Gemma 4 REST integration & Local Fallback Parser
│   ├── test/                   # Vitest unit test suite
│   ├── types/                  # Global TypeScript contracts
│   ├── App.tsx                 # Lazy-loaded router configuration
│   └── index.css               # Tailwind CSS v4 design tokens
├── LICENSE                     # MIT License
├── package.json                # Project dependencies & scripts
├── README.md                   # Project documentation
└── vite.config.ts              # Vite 8 + Tailwind v4 bundler configuration
```

---

## 🛠️ Complete Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **AI Intelligence** | **Google Gemma 4** | `gemma-4-26b-a4b-it` | Open-weight model (Apache 2.0) for Roman Urdu intent parsing, provider ranking & PKR pricing. |
| **Fail-Safe Fallback** | **Local Fallback Parser** | Built-in | Client-side rule matrix guaranteeing 100% demo uptime under low connectivity. |
| **Frontend Core** | **React** | `v19.0.0` | Modern component-based SPA architecture with Concurrent features. |
| **Language** | **TypeScript** | `v5.8.0` | Strict end-to-end type safety and compile-time verification. |
| **Build & Tooling** | **Vite** | `v8.1.3` | Ultra-fast build tool and development server (`@tailwindcss/vite`). |
| **Styling** | **Tailwind CSS** | `v4.0.0` | Modern CSS-first utility-driven styling engine with custom design tokens. |
| **Animations** | **Framer Motion** | `v12.4.7` | Smooth animations, layout transitions, and audio visualizer. |
| **Routing** | **React Router** | `v6.30.0` | Declarative client-side routing with code-splitting via `React.lazy`. |
| **Icons** | **Lucide React** | `v1.16.0` | Crisp SVG icons for all 21 Pakistani service specialties. |
| **Speech Engine** | **Web Speech API** | Native | In-browser speech-to-text recognition for hands-free Urdu/English queries. |
| **Database & Auth** | **Firebase BaaS** | `v11.4.0` | Cloud Firestore real-time listeners and Firebase Auth sessions. |
| **Testing** | **Vitest + RTL + JSDOM** | `v3.0.7` | Modern test runner and component assertions. |

---

## 🌟 Key Features

1. **Google Gemma 4 AI Intent Parser**: Analyzes unstructured Roman Urdu/English text (e.g. *"wiring inside the bathroom is sparking urgently"*), extracts category, location, urgency, and produces concise task summaries.
2. **AI PKR Fair-Price Estimator**: Computes fair service price ranges in Pakistani Rupees (PKR) with contextual explanations.
3. **Proximity-Based Provider Ranking**: Uses browser geolocation and the Haversine formula to rank specialists and calculate fair travel allowances (`Rs. 100 base + Rs. 20/km`).
4. **Dual-Profile Marketplace**: 1-click toggle between Customer mode (search & hire) and Provider mode (job feed & PKR earnings).
5. **InDrive-Style Availability**: Real-time Online/Offline toggle with GPS beacon for technicians.
6. **Real-Time Chat**: Direct two-way messaging between customers and assigned providers.

---

## 📋 Hackathon Previous Work Declaration

| Dimension | Pre-Existing Prototype (Before Event) | Built During Hackathon (New Work) |
|---|---|---|
| **AI Integration** | None (Static regex keyword matchers only) | Integrated **Google Gemma 4 (`gemma-4-26b-a4b-it`)** for intent parsing, proximity ranking, and fair PKR price estimation |
| **Local Fallback Engine** | None | Built resilient offline fallback matrix (`localFallbackParser`) ensuring zero disruption if API limits hit |
| **Dual-Role Switcher** | None | Built seamless 1-click Role Switcher in Navbar and Profile for instant Customer $\leftrightarrow$ Provider toggling |
| **Auth & Database** | Pre-existing Firebase Auth and Firestore schema (supporting infrastructure) | Reused as background plumbing so event time focused on AI capabilities |
| **Architecture & Structure** | Monolithic files, single `SharedUI.tsx`, flat page hierarchy | Modular clean architecture: feature folders (`pages/auth`, `pages/booking`, `pages/provider`, `pages/chat`), decoupled UI primitives |
| **Quality & CI/CD** | No test runner or automated pipelines | Comprehensive Vitest + Testing Library test suite, JSDOM setup, and automated GitHub Actions CI workflow |

---

## 📜 Licensing
* **Application Code**: Licensed under the [MIT License](./LICENSE).
* **AI Model Weights**: Powered by Google **Gemma 4 (`gemma-4-26b-a4b-it`)**, released under the [Apache 2.0 License](https://ai.google.dev/gemma/terms).

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Run automated tests
npm test

# 4. Build for production
npm run build
```
