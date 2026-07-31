# DevShell Frontend

Frontend application for **DevShell**, a terminal-inspired developer portfolio.  
The UI is designed as a command-line interface aesthetic with a dark/light theme, providing an interactive experience for browsing portfolio content, managing projects and blog posts, and organizing tasks via a Kanban board. Built as a single-page application with smooth page transitions.

---

## Tech Stack
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6 (SPA with nested layouts)
- **Animations:** Framer Motion (page transitions and micro-interactions)
- **SEO:** react-helmet-async (per-page meta tags)
- **HTTP Client:** Native `fetch` with JWT Bearer auth and automatic session renewal
- **Testing:** Jest + React Testing Library
- **Build Tool:** Create React App (Webpack 5, Babel, TypeScript)
- **Styling:** Custom CSS with CSS variables (terminal-inspired, dark/light mode)
- **Version Control:** Git + GitHub

---

## Core Features
- **Terminal-Inspired UI:**  
  Monospace font, command-line aesthetic, status bar, and interactive terminal page that mimics a real shell (`whoami`, `ls projects`, `ls blog`, `skills`, `contact`, `help`, `clear`).

- **Dark / Light Theme:**  
  Toggle between dark and light modes with instant CSS variable switching. Persistent preference via `localStorage`.

- **Public Portfolio (no auth required):**  
  Landing page with dashboard stats, project gallery with technology badges, paginated blog with category/tag filters, skills with proficiency bars, work experience timeline, contact form, and interactive terminal.

- **User Authentication:**  
  Login and registration pages, plus forgot-password, reset-password, and email-verification pages. The app uses short-lived JWT access tokens stored in `localStorage` and attached to every request; when a request returns `401`, the session renews transparently via the backend's HttpOnly refresh cookie and the request is retried automatically. New accounts must confirm their email through a verification link before logging in; password recovery is handled via email links too.

- **Admin Dashboard:**  
  Real-time overview with project, post, skill, and message counts. Quick access to all management sections.

- **Content Management (Admin):**  
  Full CRUD for projects (with technology multi-select), blog posts (with publish/draft toggle), skills, work experience, and portfolio technologies. All via modal forms.

- **Kanban Board (Admin):**  
  Drag-and-drop ready board management: create boards, add columns, add and reorder cards with color-coded labels (Urgent, In Review, Completed, Improvement) and due dates.

- **Visitor Content Management:**  
  Registered users can submit their own projects and posts, pending admin approval, via a dedicated "My Content" section.

- **User Administration (Admin):**  
  View pending registrations, approve or deactivate user accounts.

- **Contact Inbox (Admin):**  
  Read, mark as read, and delete messages received from the contact form.

- **CV Management (Admin):**  
  Quick-add skills and experience entries from a dedicated CV administration page.

---

## Installation & Setup

### Prerequisites
- Node.js >= 18.x
- npm >= 8.x
- Git

### Clone Repository
```bash
git clone <your-repo-url>/proyecto-devshell-nodejs-frontend.git
cd proyecto-devshell-nodejs-frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
Copy `.env.example` to `.env` and adjust if needed (defaults work in development):
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### Start Development Server
```bash
npm run iniciar
```

The app is available at `http://localhost:3000` and expects the backend at `http://localhost:8080/api`.

### Build for Production
```bash
npm run build
```

Output is written to the `build/` directory.

---

## Project Structure

```
src/
├── index.tsx                          # Entry point
├── App.tsx                            # Router with Layout
├── context/
│   └── ThemeContext.tsx                # Dark/light theme provider
├── hooks/                             # Custom hooks (useForm, useDebounce, useTheme, etc.)
├── utils/
│   ├── api.ts                         # HTTP client (fetch + JWT + timeout + auto-refresh) 
│   ├── auth.ts                        # Session management (login, logout, token decode)
│   ├── types.ts                       # TypeScript interfaces and type aliases
│   ├── constants.ts                   # App-wide constants
│   ├── helpers.ts                     # Utility functions
│   ├── validators.ts                  # Form validation
│   └── formatters.ts                  # Date and text formatters
├── services/
│   ├── authService.ts                 # Login/logout API
│   ├── projectService.ts              # Projects CRUD API
│   ├── blogService.ts                 # Blog posts CRUD API
│   ├── contactService.ts              # Contact messages API
│   └── adminService.ts                # Dashboard, Kanban, skills, experience, users API
├── components/                        # Reusable UI components (DataTable, Modal, Pagination, etc.)
└── pages/                             # Page components organized by route
    ├── HomePage.tsx                   # Landing / dashboard
    ├── ProjectsPage.tsx               # Public project gallery
    ├── BlogPage.tsx                   # Public blog listing
    ├── TerminalPage.tsx               # Interactive terminal
    ├── ContactPage.tsx                # Contact form
    ├── ForgotPasswordPage.tsx         # Request a recovery email
    ├── ResetPasswordPage.tsx          # Choose a new password via email link
    ├── VerificarCuentaPage.tsx        # Confirm email via verification link
    ├── KanbanPage.tsx                 # Kanban board
    └── admin/                         # Admin pages
        ├── ContentPage.tsx            # CRUD for all content types
        ├── MessagesPage.tsx           # Contact inbox
        ├── UsersPage.tsx              # User management
        └── CVPage.tsx                 # Skills & experience management
```

---
