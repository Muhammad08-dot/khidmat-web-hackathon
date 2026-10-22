# Product Requirements Document (PRD)
## Khidmat (خدمت) — On-Demand Home Services & Labor Marketplace

---

## 1. Problem Statement

Finding a trustworthy electrician, plumber, or technician in Pakistan today typically requires asking in informal neighborhood groups, calling random numbers off local signboards, or hoping personal recommendations are still valid. There is no single unified digital platform where a customer can describe what they need and get matched instantly with a verified, priced, and bookable professional. In the same way ride-hailing modernized personal transportation, Khidmat provides an accessible, secure platform for skilled home and technical services.

---

## 2. Solution Overview

Khidmat is a responsive web application designed for mobile and desktop where users can:
1. Describe their service requirement in plain language or via voice input (e.g., *"AC cooling nahi kar raha"* or *"kitchen tap is leaking"*).
2. Get accurately categorized and matched to nearby verified specialists via an AI intent parser and ranking engine.
3. Review estimated price ranges in PKR based on job complexity and travel distances before booking.
4. Schedule bookings with cash-on-delivery or direct confirmation.
5. Communicate directly with assigned service providers via real-time in-app chat.

---

## 3. Service Categories

Khidmat covers 21 technical and home maintenance specialties tailored for the local market:

* **Home & Electrical**: Electrician, Plumber, Carpenter, Painter, AC Technician, House Cleaner, Appliance Repair, Mechanic, Gardener.
* **Specialized & Field Services**: Movers & Packers, Pest Control, CCTV Technician, Welder, Mason, Handyman, Locksmith, Solar Technician, IT & Network Repair.
* **Events & Creative**: Photographer, Videographer, Tailor.

---

## 4. Key Capabilities & Features

* **Authentication & Profile Management**: Firebase Auth with role-based access for Customers and Service Providers.
* **Smart Voice & Text Search**: Web Speech API integration for speech-to-text queries with real-time audio visualization.
* **AI Intent Parser**: Natural language processing extracts service category, urgency level, and concise job summaries.
* **AI Provider Matcher & Dynamic Ranking**: Compares user coordinates with available providers, factoring in proximity, customer ratings, completed jobs, and availability.
* **AI PKR Price Estimator**: Calculates market-accurate pricing ranges with contextual explanations.
* **Automated Geolocation**: Dynamic browser geolocation calculation (Haversine formula), travel duration estimation, and automated travel allowance fees (Rs. 100 base + Rs. 20/km).
* **Provider Availability Toggle**: InDrive-style online/offline status switch filtering inactive providers in real-time.
* **Real-Time Chat**: Live two-way messaging between customers and providers with Firestore real-time listeners.
* **Dynamic Tier System**: Progression levels (Bronze, Silver, Gold, Platinum) calculated dynamically from ratings and completed jobs.
* **Atomic Earnings Transactions**: Transactional updates to worker earnings and job history upon review submission.
* **Theme Support**: Persistent Dark and Light modes styled with Tailwind CSS.

---

## 5. Technology Stack

* **Frontend**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS v4, Vanilla CSS design tokens
* **Motion & Animation**: Framer Motion
* **Icons**: Lucide React
* **Routing**: React Router (with React.lazy and Suspense code splitting)
* **Backend & Authentication**: Firebase Authentication & Cloud Firestore (with zero-config local storage mock DB fallback)
* **Real-Time Communication**: Cloud Firestore Real-time Listeners
* **Generative AI**: Google Gemini API (REST client with regex fallback)
* **Testing**: Vitest, React Testing Library, JSDOM

---

## 6. System Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────┐
│               React 19 Frontend (SPA)                  │
│   (Home / Auth / Booking / Chat / Provider Dashboard)   │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌────────────────────────┐      ┌─────────────────────────┐
│  Firebase / Mock DB    │      │    Google Gemini API    │
│  - Users & Providers   │      │  - Intent Parser        │
│  - Bookings            │      │  - Provider Matcher     │
│  - Real-Time Chats     │      │  - Price Estimator      │
└────────────────────────┘      └─────────────────────────┘
```

---

## 7. Core Collections (Firestore Schema)

* **`users/{userId}`**: Stores credentials, role (`customer` | `provider`), contact details, and geolocation coordinates.
* **`providers/{providerId}`**: Indexed provider profiles with category, base price, tier, rating, completed jobs, and online availability.
* **`bookings/{bookingId}`**: Booking details including customer and provider IDs, scheduled time, address, travel fees, status (`pending`, `confirmed`, `completed`, `cancelled`), and customer ratings.
* **`chats/{bookingId}/messages/{messageId}`**: Real-time message exchange between customer and matched provider.

---

## 8. Product Roadmap

1. Verified CNIC & SMS OTP phone authentication for provider vetting.
2. Digital wallet and payment gateway integrations (JazzCash, EasyPaisa, credit/debit cards).
3. Push notifications for instant booking updates.
4. Mobile application packaging using React Native / Expo.
5. In-app photo attachments for job completion verification and dispute resolution.
