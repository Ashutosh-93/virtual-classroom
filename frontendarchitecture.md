========================================================================
EDUZANT ARCHITECTURAL BLUEPRINT & PERMISSIONS MATRIX (architecture.md)

    FRONTEND PROJECT REPOSITORY TREE

This structural map establishes the strict location for every file in the
Eduzant client environment. Content that swaps inside the main dashboard
workspace must be created within the "views/" folder, keeping the "pages/"
folder exclusive to full-screen viewport overrides.

src/
├── assets/                    # Static vectors, SVG branding marks, and system graphics
├── components/
│   ├── auth/
│   │   ├── InstructorRoute.jsx # Route guard restricting access to validated teachers
│   │   └── ProtectedRoute.jsx  # Security gate validating active user session tokens
│   ├── layout/
│   │   ├── GlobalLayoutShell.jsx # Main 3-pane responsive dashboard shell layout
│   │   ├── Navbar.jsx          # Fixed upper header strip hosting search and user menus
│   │   └── Sidebar.jsx         # Collapsible dynamic rail handling viewMode lists
│   └── ui/                    # Atomic minimalist UI elements (Buttons, Inputs, Badges)
├── context/
│   └── ThemeContext.jsx       # Tailwind v4 class-based dark mode state engine
├── features/
│   └── auth/
│       └── authSlice.js       # Redux slice handling authentication payloads and roles
├── pages/                     # FULL-SCREEN OVERRIDES (No navigation shell rails present)
│   ├── LectureTheater.jsx     # High-focus streaming interface located at /watch/:id
│   ├── Login.jsx              # Clean minimalist user entrance terminal card
│   ├── Signup.jsx             # Account registration entry system panel
│   └── VerifyOtp.jsx          # Safe authentication cellular signature gateway
└── views/                     # INTERCHANGEABLE WORKSPACE VIEWS (Mount inside Shell Outlet)
├── AccountSettingsView.jsx # Personal preferences holding "Become Instructor" actions
├── CourseDetailsView.jsx  # Multi-state view tracking owned vs unpurchased blueprints
├── InstructorStudioView.jsx # Creator canvas tracking course drafts and modules
├── MarketplaceHome.jsx    # Complete discovery catalog replacing the old home layout
├── RevenueLedgerView.jsx  # Financial overview balances, earnings charts, and grids
├── SearchResultsView.jsx  # Real-time search directory updated via navbar query bars
└── StudentDashboardView.jsx # Progress metrics tracking streaks and active watch hours

    CORE VIEWPORT ALLOCATION MATRIX

The workspace is managed by a structural three-point grid layout alignment.
The Navbar and Sidebar elements stay static during view modifications to
prevent flashing, while the interchangeable view layers map smoothly inside:

┌────────────────────────────────────────────────────────────────────────┐
│  Eduzant  [Brand]         [🔍 Core Search Input]        [Profile Drop] │ ◄─ Navbar (Fixed)
├───────────────┬────────────────────────────────────────────────────────┤
│ 🡄   SIDEBAR   │  VIEW REPLACEMENT ZONE                                 │
│               │                                                        │
│ • Library     │  ┌──────────────────────────────────────────────────┐  │
│ • Analytics   │  │                                                  │  │ ◄─ Dynamic View
│ • Switch Mode │  │  SearchResultsView / CourseDetailsView          │  │    (React Router
│               │  │  mounts here without shifting navigation rails   │  │     )
│ [Fixed Width] │  │                                                  │  │
└───────────────┴────────────────────────────────────────────────────────┘

    SIDEBAR NAVIGATION METRICS & LINKS

The links rendering across the vertical dashboard rail adapt instantly
the millisecond a validated instructor toggles their active operational mode.

A. The Student Hub Track (viewMode === 'student')
• My Learning Workspace: The student home console tracking active enrollments,
overall completion percentages, and automated gamified daily learning streaks.
• My Library: Grid system showcasing cards for all explicitly owned blueprints.
• Wishlist & Saved Tracks: A custom bookmarks panel tracking saved items.
• Certificates & Achievements: A secure personal vault hosting verified
course completion credentials and sharing endpoints.
• Purchase Logs: Digital financial statement tracking transaction receipts.

B. The Instructor Hub Track (viewMode === 'instructor')
• Course Studio: The creator command center used to design course structures,
manage section nodes, upload video resources, and set pricing details.
• Student Roster: Interactive database logging enrolled student profiles,
submitted review ratings, and lesson-by-lesson student Q&A threads.
• Revenue Ledger: High-contrast data panels displaying net systems earnings,
monthly sales trajectories, and graphical performance tracking maps.
• Payout Wallet: Direct financial settings screen to establish UPI IDs or
bank clearance information for automated monthly revenue processing.

    SYSTEM INTERACTION FLOWS

• Seamless Search Extraction Flow: When a search is triggered in the Navbar,
the client-side action is intercepted. It halts hard browser document
reloads, updates the URL path to /search?q=query, and forces the
SearchResultsView to immediately render in the Replacement Zone.

• The Edge Minimization Chevron Toggle: A tactile arrow trigger sits directly
on the inside vertical border line of the Sidebar. Tapping it transforms
the panel from a w-64 block to a w-16 icon strip. Menu text fades out,
giving detailed structural views (like CourseDetailsView) immediate access
to 95%+ of the viewport to display technical data grids cleanly.

• Hierarchical Role Shift Handshake:

    Base Tier: All user signups register under role: "student". The sidebar
    workspace switcher module remains completely hidden from view.

    The Gateway: The student navigates into AccountSettingsView and triggers
    the "Become an Instructor" CTA block, sliding open the phone verification panel.

    The Promotion: Once the OTP challenge resolves successfully, the backend
    database promotes their account record array to role: "teacher".

    The Integration: A dropdown workspace selector immediately mounts at the
    top edge of the sidebar. The user can swap between learning tracking and
    instructor studio views smoothly with zero authentication reloads.

    DYNAMIC ROUTING TREE BLUEPRINT (src/App.jsx Structure)

Below is the definitive configuration roadmap for setting up the
application's central routing engine to govern Pages and Views securely:
JavaScript

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Core Application Structural Shell Layout
import GlobalLayoutShell from './components/layout/GlobalLayoutShell';

// Full-Screen System Independent Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import LectureTheater from './pages/LectureTheater';

// Interchangeable Internal Content Views
import MarketplaceHome from './views/MarketplaceHome';
import SearchResultsView from './views/SearchResultsView';
import CourseDetailsView from './views/CourseDetailsView';
import StudentDashboardView from './views/StudentDashboardView';
import AccountSettingsView from './views/AccountSettingsView';
import InstructorStudioView from './views/InstructorStudioView';
import RevenueLedgerView from './views/RevenueLedgerView';

// Architectural Security Route Guard Protectors
import ProtectedRoute from './components/auth/ProtectedRoute';
import InstructorRoute from './components/auth/InstructorRoute';

export default function App() {
  return (
    <Routes>
      {/* --- STATIC FULL-SCREEN ENTRY HOOKS (Bypasses Navigation Layout Shell) --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      
      {/* --- HIGH-FOCUS FULL-SCREEN LEARNING INTERFACE --- */}
      <Route 
        path="/watch/:courseId" 
        element={
          <ProtectedRoute>
            <LectureTheater />
          </ProtectedRoute>
        } 
      />

      {/* --- RUNTIME LAYOUT PLATFORM SHELL (Navbar + Collapsible Sidebar Mounted) --- */}
      <Route element={<GlobalLayoutShell />}>
        {/* Replaceable Views Render Instantly Inside the Core Layout Shell Outlet */}
        <Route path="/" element={<MarketplaceHome />} />
        <Route path="/search" element={<SearchResultsView />} />
        <Route path="/course/:id" element={<CourseDetailsView />} />
        
        {/* Guarded Student Platform Views */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboardView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/settings" 
          element={
            <ProtectedRoute>
              <AccountSettingsView />
            </ProtectedRoute>
          } 
        />

        {/* Guarded Teacher Platform Views */}
        <Route 
          path="/instructor/studio" 
          element={
            <InstructorRoute>
              <InstructorStudioView />
            </InstructorRoute>
          } 
        />
        <Route 
          path="/instructor/revenue" 
          element={
            <InstructorRoute>
              <RevenueLedgerView />
            </InstructorRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

========================================================================