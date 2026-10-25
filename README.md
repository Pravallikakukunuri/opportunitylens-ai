# 🔍 OpportunityLens AI
> **AI-Powered Scam Shield & Skill Gap Navigator for College Students and Freshers**  
> *Built for Hackathons • React + TypeScript + Vite + Tailwind CSS + React Router*

---

## 🎯 Overview & Mission

College freshers and students are prime targets for employment fraud, including advance-fee "security deposit" scams, fake data-entry roles, phishing via Telegram/WhatsApp, and predatory unpaid internships masquerading as tech positions. At the same time, students struggle to gauge how their academic skills align with real job requirements.

**OpportunityLens AI** solves both challenges with a unified, transparent platform:
1. **Scam Warning Detection**: Dissects job postings into **Direct Text Evidence**, **Analytical AI Inferences**, and **Unknown Information** that must be independently verified. Never makes definitive claims of total safety or legal fraud based on text alone.
2. **Transparent Skill Matching**: Evaluates core and secondary skill prerequisites using an auditable, transparent weighted formula—no black-box AI scores.
3. **Learn, Build & Practice Action Plan**: For any missing skill, generates a high-yield 3-pillar roadmap:
   - 📚 **Learn**: Foundational concepts and curated free documentation/courses with time estimates.
   - 🛠️ **Build**: Portfolio project with concrete GitHub deliverables to prove hands-on mastery.
   - 🎯 **Practice**: Frequently asked interview questions, coding scenarios, and key takeaways.
4. **Pipeline Tracking**: Stores saved opportunities in `localStorage` with real-time status tracking (`Interested`, `Applied`, `Interviewing`, `Offer`, `Rejected`, `Flagged / Archived`), personal notes, and JSON export.

---

## 🚀 Quick Start & How to Launch

### Prerequisites
- Node.js (v18 or higher recommended; verified with v22.20.0)
- npm (v9 or higher; verified with v10.9.3)

### Installation & Launch Steps

1. **Clone or Navigate to the Project Directory**:
   ```bash
   cd opportunitylens-ai
   ```

2. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to:
   ```
   http://localhost:5173/
   ```

5. **Build for Production** (optional verification):
   ```bash
   npm run build
   ```

---

## 📱 Pages & Features

| Page | Description |
|---|---|
| **Dashboard** (`/`) | High-level metrics, active pipeline breakdown, student scam alert ticker, quick text scanner, and 1-click test scenarios. |
| **Analyze Opportunity** (`/analyze`) | Paste job postings or recruiter DMs. Inspects scam markers, extracts skills, shows calculation formula, and renders Learn-Build-Practice roadmaps. |
| **Saved Opportunities** (`/saved`) | Kanban-style application tracker with search, status filters, risk filters, sorting, inline status updates, and JSON pipeline export. |
| **My Skill Profile** (`/profile`) | Student competency passport. Manage categorized skills with proficiency levels, or switch instant presets (*Frontend Aspirant*, *Backend & Cloud*, *AI & Data*). |
| **Settings** (`/settings`) | Inspect the active client-side Demo Heuristic Engine, configure detection sensitivity (Conservative, Balanced, Lenient), toggle alerts, and reset demo data. |

---

## 🧪 1-Click Evaluation Presets

To test the application immediately without typing:
1. **Suspicious Telegram Data Entry Task** (*High Risk Example*): Flags upfront ₹3,999 UPI laptop deposit, anonymous Telegram contact, `@gmail.com` address, and unrealistic pay for typing.
2. **Legitimate Junior Frontend Developer** (*Low Risk Example*): Recognizes multi-stage technical interviews, corporate career portal link, transparent tech stack (React, TypeScript, Tailwind, Jest), and explicit anti-deposit compliance statement.
3. **Unpaid / Commission Growth Trainee** (*Medium Caution Example*): Detects unpaid 3-month probation and sales quotas disguised as an engineering internship.
4. **Associate Backend Engineer** (*Low Risk Example*): Parses Python, FastAPI, PostgreSQL, Docker, and AWS skills with transparent match math.

---

## 🛡️ Responsible AI & Ethical Philosophy

OpportunityLens AI adheres to strict ethical and security guidelines:
- **No False Claims**: An automated algorithm can **never** certify an opportunity as 100% safe or legally fraudulent based solely on a text snippet. The tool acts as an assistive lens highlighting red flags and unverifiable points.
- **Privacy First**: Analysis runs entirely client-side using deterministic heuristic NLP and weighted calculation rules. No user resumes or text snippets are uploaded to external third-party servers.
- **Zero API Key Exposure**: The built-in heuristic engine requires zero API keys. Any optional BYOK keys entered in Settings are kept strictly in local browser storage.

---

## 🛠️ Architecture & Dual AI Engine

OpportunityLens AI uses a defense-in-depth, dual-engine architecture:

1. **Provider 1: Google Gemini AI (Backend Endpoint `/api/ai-analyze`)**
   - Performs semantic NLP extraction of core requirements, preferred skills, inferred prerequisites, and nuanced warning excerpts.
   - Keys are kept 100% server-side via `process.env.GEMINI_API_KEY`. No secret is ever bundled into client JavaScript.
2. **Provider 2: Deterministic Heuristic Engine (Offline / Fallback)**
   - Operates 100% locally in browser memory or Node.js without any network or API keys required.
   - Computes deterministic skill-match percentages and scam-risk scores using auditable mathematical formulas.

> [!IMPORTANT]
> **Deterministic Mathematical Guarantee**: The final scam-risk score (`15-100%`) and skill match percentage (`0-100%`) are ALWAYS computed by deterministic arithmetic formulas. Gemini AI provides semantic extraction and warning quotes; it can NEVER arbitrarily manipulate or override deterministic mathematical scores.

---

## 🚀 Quick Start & How to Launch

### Prerequisites
- Node.js (v18 or higher recommended; verified with v22.20.0)
- npm (v9 or higher; verified with v10.9.3)

### Installation & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables** (Optional for live Gemini extraction):
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/):
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
   *(If omitted, OpportunityLens operates seamlessly in transparent deterministic fallback mode).*

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Run Unit Tests**:
   ```bash
   npm test
   ```

5. **Run Code Linter**:
   ```bash
   npm run lint
   ```

---

## 🌐 Production Deployment Guide

OpportunityLens AI is production-ready and supports multiple hosting models:

### Option A: Standalone Node.js Server (Recommended for VPS, Docker, Render, Railway, AWS ECS)
1. **Build the production frontend bundle**:
   ```bash
   npm run build
   ```
2. **Start the production server**:
   ```bash
   npm start
   ```
   The standalone production server (`server.mjs`) serves the optimized React SPA bundle from `dist/` and runs the secure `/api/ai-status` and `/api/ai-analyze` endpoints on `http://localhost:3000` (or `PORT` defined in environment).

### Option B: Serverless Deployment (Vercel / Netlify / Cloudflare Pages)
- Set `GEMINI_API_KEY` in your platform's environment variable dashboard.
- The built static assets in `dist/` can be served from edge CDN.
- If using serverless functions, map `/api/ai-status` and `/api/ai-analyze` to Node serverless functions.

---

## 📱 Pages & Features

| Page | Description |
|---|---|
| **Dashboard** (`/`) | High-level metrics, active pipeline breakdown, student scam alert ticker, quick text scanner, and 1-click test scenarios. |
| **Analyze Opportunity** (`/analyze`) | Paste job postings or recruiter DMs. Inspects scam markers, extracts skills, shows calculation formula, and renders Learn-Build-Practice roadmaps. |
| **Saved Opportunities** (`/saved`) | Kanban-style application tracker with search, status filters, risk filters, sorting, inline status updates, and JSON pipeline export. |
| **My Skill Profile** (`/profile`) | Student competency passport. Manage categorized skills with proficiency levels, or switch instant presets (*Frontend Aspirant*, *Backend & Cloud*, *AI & Data*). |
| **Settings** (`/settings`) | Inspect dual-mode architecture, test live Gemini connection, configure detection sensitivity (Conservative, Balanced, Lenient), toggle alerts, and reset demo data. |

---

## 🛡️ Responsible AI & Ethical Philosophy

OpportunityLens AI adheres to strict ethical and security guidelines:
- **Text-Only Limitation Disclaimer**: An automated algorithm can **never** certify an opportunity as 100% safe or legally fraudulent based solely on a text snippet. The tool acts as an assistive lens highlighting red flags and unverifiable points.
- **Baseline Uncertainty Floor**: All assessments enforce a minimum 15% baseline uncertainty floor. No unverified textual claim is ever rated 0% risk.
- **Zero API Key Exposure**: Secrets are loaded exclusively server-side. No API keys are ever bundled into client assets or printed in client logs.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript (Strict mode)
- **Build Tool**: Vite 8 with code splitting and lazy-loaded routes
- **Test Runner**: Vitest 5
- **Linter**: Oxlint
- **Styling**: Tailwind CSS v4 with custom navy SaaS palette (`#0a1128`, `#0f172a`, `#4f46e5`)
- **Icons**: Lucide React
- **Routing**: React Router v7 with dynamic chunk loading
- **Storage**: Browser `localStorage` with seed fallback data

