# CampusFix 🏫

**Making campus problem reporting simpler, smarter, and more transparent.**

CampusFix is a campus issue reporting and tracking platform that helps students report problems such as water leaks, broken lights, Wi-Fi issues, and other campus maintenance concerns. It organizes complaints, categorizes them, assigns priorities and departments, and lets users track their progress.

🔗 **Live Demo:** https://campus-fix-flax-delta.vercel.app/

## ✨ Features

- **Easy Complaint Submission** — Report campus issues using a description, location, and optional image.
- **Automatic Categorization** — Classifies complaints into relevant categories and subcategories.
- **Priority Assignment** — Assigns a priority level to help organize reported issues.
- **Department Mapping** — Routes complaints to the relevant campus department.
- **Complaint Tracking** — Stores complaints and tracks their status as they progress.
- **Complaint History** — Maintains updates to improve transparency.
- **Suggested Actions** — Generates summaries, recommended actions, and email drafts for reporting issues.
- **Persistent Database** — Stores complaint details using Supabase.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend and API routes |
| React | User interface |
| TypeScript | Type-safe application code |
| Supabase | Database and backend data storage |
| Vercel | Deployment and hosting |
| Node.js | JavaScript runtime |

## ⚙️ How It Works

1. A student submits a complaint with a description and optional image.
2. The application processes the complaint using its current rule-based classification logic.
3. The system determines a category, priority, department, and suggested action.
4. The complaint is saved to Supabase.
5. The student can view the complaint and follow its status and updates.

> **Current implementation:** Complaint categorization uses rule-based logic. The project can be extended with an AI model for image understanding and more advanced complaint analysis.

## 🚀 Run Locally

### Prerequisites

- Node.js and npm
- A Supabase project
- Git

### 1. Clone the repository

```bash
git clone https://github.com/aanyakuchhal/CampusFix.git
cd CampusFix
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Replace the placeholders with your own Supabase credentials.

**Security:** Never commit `.env.local` or expose the service-role key in frontend code or public repositories.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔮 Future Improvements

- Integrate an AI model for image-based complaint understanding.
- Improve complaint categorization and priority prediction.
- Add authentication and role-based access for students and administrators.
- Enable authorized departments to manage and resolve complaints.
- Add resolution feedback and optional public visibility for complaints.
- Build analytics to identify recurring campus issues.

## 🌱 Vision

CampusFix aims to make campus issue reporting more accessible, organized, and transparent, helping students communicate problems and campus authorities manage them more efficiently.

---

**Built during Breakthrough 1.0** — a beginner-friendly campus hackathon.

