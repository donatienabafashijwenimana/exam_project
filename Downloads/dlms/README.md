# Rwanda DLMS – Driving License Management System
## Module: ITLDF601 – Frontend Development | RP Karongi College

---

## Tech Stack
- **React 18** + **Vite 5**
- **Material UI v5** – DataGrid, Dialogs, Steppers, ThemeProvider
- **Recharts** – 6+ analytics charts
- **React Router v6** – Full client-side routing with role guards
- **SCSS (Sass)** – Modular component styles

---

## Three User Roles

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **👮 Admin** | admin@dlms.rw | admin123 | Full control: view/approve/reject/assign/delete all |
| **👨‍🏫 Instructor** | instructor@dlms.rw | inst123 | View assigned, record theory/practical results |
| **👤 Learner** | learner@dlms.rw | learn123 | Apply, track status, view test results, view license |

---

## Getting Started
```bash
npm install
npm run dev
```
Open http://localhost:5173

---

## Features

### ✅ Architecture
- Modular React (component/context/pages/data/theme/styles)
- Context API: `AuthContext` (auth + role) + `AppContext` (state)
- SCSS modules per component (`*.module.scss`)
- Protected routes per role (redirects if unauthorized)

### ✅ Dark / Light Mode
- MUI ThemeProvider – government navy/gold palette
- Toggle in **Header** (top-right) — works on all pages
- Sidebar also adapts automatically

### ✅ Routing (React Router v6)
- `/login` — Split-panel login page
- `/admin/*` — Dashboard, Applications, Analytics
- `/instructor/*` — Dashboard, Assigned, Record Results
- `/learner/*` — Dashboard, Apply, Status, License

### ✅ Admin: Application Management
- MUI DataGrid with sorting, filtering, quick search, pagination
- View modal with 5 tabs: Personal Info, Documents, Test Results, Officer Notes, License
- Approve (generates license number) with required officer comment
- Reject with required officer comment + confirmation
- Assign instructor to applicant
- Delete with confirmation dialog

### ✅ Admin: Analytics (6 charts)
- Line chart: Monthly trends (applications/approved/rejected)
- Area chart: Approval trend
- Pie chart: Application status distribution
- Bar chart: License type (category) distribution
- Horizontal stacked bar: Test center pass/fail %
- Grouped bar: Theory vs Practical pass rates

### ✅ Instructor Portal
- View assigned learners with test status
- Record theory test (result, score, comments)
- Record practical test (only after theory complete)
- All results stored live and visible to admin + learner

### ✅ Learner Portal
- 3-step application form with Stepper UI
- Personal details → Test preferences → Document upload
- Application status tracker with Stepper progress bar
- View both test results with scores and comments
- Digital License Preview (if approved) — styled ID card with license number

### ✅ Form Validations
| Field | Validation Rule |
|-------|----------------|
| National ID | Exactly 16 digits (numeric only) |
| Email | Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Phone | 10–13 digits only |
| Required fields | Checked on each step before proceeding |
| File type | Only JPG, PNG, PDF allowed |
| File size | Maximum 5MB per file |
| Score | Must be 0–100 (numeric) |
| Officer comment | Required before approve/reject |

### ✅ Responsive Design
- Mobile sidebar with overlay (hamburger menu)
- Collapsible sidebar on desktop (chevron toggle)
- Grid layouts adapt to all screen sizes

---

## Project Structure
```
src/
├── App.jsx                    # Routes + ThemeProvider
├── main.jsx                   # React root
├── theme/theme.js             # MUI navy/gold theme
├── styles/                    # Global SCSS + variables
├── context/
│   ├── AuthContext.jsx        # Login/logout/role check
│   └── AppContext.jsx         # Applications state
├── data/mockData.js           # 3 users + 6 applications + chart data
├── components/
│   ├── auth/Login.jsx         # Split-panel login
│   ├── layout/                # Sidebar, Header, Layout
│   └── shared/ProtectedRoute.jsx
└── pages/
    ├── admin/                 # AdminDashboard, AdminApplications, AdminAnalytics
    ├── instructor/            # InstructorDashboard, InstructorAssigned, InstructorResults
    └── learner/               # LearnerDashboard, LearnerApply, LearnerStatus, LearnerLicense
```
