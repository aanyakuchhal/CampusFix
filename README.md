# CampusFix 🏫

**A campus complaint management system that helps students report issues and track their resolution.**

CampusFix is a web application prototype designed to make reporting campus problems simpler and more transparent. Students can submit complaints about issues such as broken lights, water leakage, and Wi-Fi outages, while the application organizes reports and tracks their status.

## ✨ Features

- **Complaint submission:** Report campus issues with a description, location, and optional image.
- **Complaint classification:** Categorize complaints and assign priority levels.
- **Department assignment:** Associate complaints with the relevant campus department.
- **Complaint tracking:** View complaint details and current status.
- **Status history:** Maintain a timeline of complaint submissions and status changes.
- **Database integration:** Store and retrieve complaint information using Supabase.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Backend and database:** Node.js, Supabase, PostgreSQL
- **Version control:** Git and GitHub

## 🚧 Work in Progress

- Image-based AI analysis of uploaded complaint photos
- Authority dashboard for managing and resolving complaints
- Improved access control and production-ready security

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   cd CampusFix
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and configure the required environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Use the actual variable names expected by the application. Never commit real credentials or service-role keys.

4. Start the Next.js development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

**Note:** If the application uses a separate Node.js backend, follow its startup instructions as well. Check `package.json` and `server.js` for the required command and environment variables.

## 🧪 Project Status

CampusFix is an actively developed prototype. Core complaint storage, complaint details, and status-history tracking have been implemented. AI image analysis and the authority dashboard remain in development.

## 👩‍💻 Contributors

Built as a team project during Breakthrough 1.0, a beginner-friendly campus hackathon.

## 📄 License

A license has not yet been selected.
