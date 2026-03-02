# System Architecture - Admin Management System

## Overall System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TOURISM APP SYSTEM                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────┐  ┌─────────────────┐  ┌──────────────────┐     │
│  │   USER FLOW       │  │   ADMIN FLOW    │  │  IMAGE UPLOAD    │     │
│  ├───────────────────┤  ├─────────────────┤  ├──────────────────┤     │
│  │ Register/Login    │  │ Login/Logout    │  │ /api/upload      │     │
│  │ Build Package     │  │ Dashboard       │  │ Returns: Base64  │     │
│  │ Upload Image      │  │ Manage Status   │  │ Data URL         │     │
│  │ Submit Request    │  │ View Users      │  └──────────────────┘     │
│  │ View Status       │  │ Approve/Reject  │                           │
│  └───────────────────┘  └─────────────────┘                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication System

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USER AUTHENTICATION              ADMIN AUTHENTICATION                  │
│  ────────────────────────         ────────────────────────              │
│                                                                          │
│  /auth/login (POST)               /api/admin/login (POST)              │
│       ↓                                  ↓                              │
│  Check Credentials                 Check Credentials                    │
│       ↓                                  ↓                              │
│  Create Session                    Create Session                       │
│       ↓                                  ↓                              │
│  Set Cookie:                       Set Cookie:                          │
│  tourism_session                   admin_session                        │
│       ↓                                  ↓                              │
│  User Routes                       Admin Routes                         │
│  Protected by                      Protected by                         │
│  getSession()                      getAdminSession()                    │
│                                                                          │
│  Separate Cookies!                                                      │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         DATA STRUCTURES                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User                          CustomPackageRequest (UPDATED)           │
│  ─────                         ────────────────────────────              │
│  • id                          • id                                      │
│  • email                       • userId                                  │
│  • password                    • basePackageId                           │
│  • name                        • basePackageTitle                        │
│  • phone                       • customPlaces[]                          │
│  • address                     • selectedFoodVarieties[]                 │
│  • createdAt                   • duration                                │
│                               • numberOfPeople                          │
│  Admin Session                 • budget                                  │
│  ──────────────                • specialRequirements                     │
│  • adminId                     • imageUrl ✨ (NEW!)                      │
│  • email                       • status (pending/approved/rejected)      │
│  (HTTP-only cookie)            • createdAt                               │
│                               • updatedAt                                │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## API Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         API ENDPOINTS                                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USER APIs                     ADMIN APIs (Protected)                   │
│  ──────────                    ────────────────────────                  │
│                                                                          │
│  /api/auth/                    /api/admin/                              │
│  ├─ login (POST)               ├─ login (POST)                          │
│  ├─ logout (POST)              ├─ logout (POST)                         │
│  ├─ register (POST)            ├─ users/                                │
│  ├─ session (GET)              │  └─ GET - All users                    │
│  └─ profile (GET)              ├─ custom-packages/                      │
│                                │  ├─ GET - All packages                 │
│  /api/packages/                │  └─ [id]/                              │
│  ├─ GET - All packages         │     └─ PATCH - Update status           │
│  └─ [id]/ (GET)                │                                        │
│                                │  Requires: admin_session cookie        │
│  /api/custom-packages/         │  Response: 401 if not authenticated    │
│  ├─ POST - Create request      │                                        │
│  └─ GET - User's requests      │                                        │
│                                │  /api/upload/ (Any authenticated user) │
│  /api/upload/ (POST)           ├─ POST - Upload image                   │
│  └─ Upload image file          └─ Returns: { imageUrl: base64 }         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Admin Dashboard Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD (/admin/dashboard)                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Header: Admin Dashboard            [Logout Button]             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Tabs: [Users] [Custom Packages]                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────┐ ┌──────────────────────────────┐  │
│  │ USERS TAB                        │ │ PACKAGES TAB                 │  │
│  ├──────────────────────────────────┤ ├──────────────────────────────┤  │
│  │                                  │ │ Filters: All | Pending |    │  │
│  │ [User Card 1]                    │ │ Approved | Rejected        │  │
│  │ ├─ Name                          │ │                            │  │
│  │ ├─ Email                         │ │ [Package Card 1]           │  │
│  │ ├─ Phone                         │ │ ├─ User Details            │  │
│  │ ├─ Address                       │ │ ├─ Image Preview ✨        │  │
│  │ └─ Join Date                     │ │ ├─ Status Badge            │  │
│  │                                  │ │ ├─ [Show Details]          │  │
│  │ [User Card 2]                    │ │ ├─ Details Section (expanded) │
│  │ ├─ Name                          │ │ │  ├─ Duration            │  │
│  │ ├─ Email                         │ │ │  ├─ People              │  │
│  │ ├─ Phone                         │ │ │  ├─ Budget              │  │
│  │ ├─ Address                       │ │ │  ├─ Places              │  │
│  │ └─ Join Date                     │ │ │  ├─ Foods               │  │
│  │                                  │ │ │  └─ Requirements        │  │
│  │ [User Card 3]                    │ │ ├─ [Approve] [Reject]     │  │
│  │ ...more cards...                 │ │                            │  │
│  │                                  │ │ [Package Card 2]           │  │
│  │                                  │ │ ...more cards...           │  │
│  │                                  │ │                            │  │
│  └──────────────────────────────────┘ └──────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Image Upload Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    IMAGE UPLOAD WORKFLOW                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  USER SIDE                                                              │
│  ──────────                                                             │
│  /build-custom-package                                                 │
│         ↓                                                               │
│  [Upload Image Input]                                                  │
│  Click or Drag & Drop                                                  │
│         ↓                                                               │
│  handleImageChange()                                                   │
│  ├─ File validation                                                    │
│  ├─ Show preview                                                       │
│  └─ Upload to /api/upload                                              │
│         ↓                                                               │
│  /api/upload (POST)                                                    │
│  ├─ Receive FormData with file                                         │
│  ├─ Convert to base64                                                  │
│  └─ Return: { imageUrl: "data:image/jpeg;base64,..." }                 │
│         ↓                                                               │
│  Store imageUrl in state                                               │
│         ↓                                                               │
│  Submit Package Form                                                   │
│  ├─ Include imageUrl in request                                        │
│  └─ Send to /api/custom-packages                                        │
│         ↓                                                               │
│  /api/custom-packages (POST)                                            │
│  ├─ Receive imageUrl                                                   │
│  ├─ Pass to createCustomPackageRequest()                                │
│  └─ Store in database                                                  │
│                                                                          │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                          │
│  ADMIN SIDE                                                             │
│  ──────────                                                             │
│  /admin/dashboard                                                      │
│         ↓                                                               │
│  Custom Packages Tab                                                   │
│         ↓                                                               │
│  Fetch /api/admin/custom-packages                                      │
│         ↓                                                               │
│  Display Package Cards                                                 │
│  ├─ Check for imageUrl                                                 │
│  ├─ If exists: Show image preview                                      │
│  └─ User can see their image                                           │
│         ↓                                                               │
│  Admin Reviews & Approves/Rejects                                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      COMPONENT HIERARCHY                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Root Layout                                                            │
│  ├─ Navigation ✨ (Updated with Admin link)                             │
│  └─ Pages                                                               │
│     ├─ Home (/)                                                         │
│     ├─ Auth Pages                                                       │
│     │  ├─ login                                                         │
│     │  └─ register                                                      │
│     ├─ User Pages                                                       │
│     │  ├─ packages                                                      │
│     │  ├─ dashboard                                                     │
│     │  └─ build-custom-package                                          │
│     │     └─ CustomizationForm ✨ (Updated with image upload)           │
│     │                                                                   │
│     └─ ADMIN Pages ✨ (NEW)                                             │
│        ├─ admin/login                                                   │
│        │  └─ Admin login form                                           │
│        └─ admin/dashboard ✨ (NEW)                                      │
│           ├─ Users Tab                                                  │
│           │  └─ User Cards (Grid)                                       │
│           └─ Custom Packages Tab                                        │
│              ├─ Status Filters                                          │
│              └─ Package Cards                                           │
│                 ├─ User Info Section                                    │
│                 ├─ Image Preview ✨                                     │
│                 ├─ Status Badge                                         │
│                 ├─ Expandable Details                                   │
│                 └─ Action Buttons (Approve/Reject)                      │
│                                                                          │
│  Utilities                                                              │
│  ├─ Components/ui/*                                                     │
│  ├─ lib/auth.ts ✨ (Updated with admin functions)                       │
│  ├─ lib/db.ts ✨ (Updated with admin functions)                         │
│  └─ lib/utils.ts                                                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD STATE MANAGEMENT                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  /admin/dashboard Component                                             │
│  ├─ State: activeTab ('users' | 'packages')                             │
│  ├─ State: users (User[])                                               │
│  ├─ State: packages (CustomPackageRequest[])                            │
│  ├─ State: selectedStatus ('all' | 'pending' | 'approved' | 'rejected')  │
│  ├─ State: expandedPackageId (string | null)                            │
│  ├─ State: isLoading (boolean)                                          │
│  │                                                                      │
│  ├─ Effects:                                                            │
│  │  └─ useEffect(() => { checkAdminAndFetch() }, [])                    │
│  │     ├─ Fetch /api/admin/users                                       │
│  │     ├─ Fetch /api/admin/custom-packages                             │
│  │     └─ Set states                                                   │
│  │                                                                      │
│  ├─ Handlers:                                                           │
│  │  ├─ handleLogout()                                                   │
│  │  │  ├─ POST /api/admin/logout                                       │
│  │  │  └─ Router.push('/admin/login')                                  │
│  │  │                                                                  │
│  │  ├─ handleStatusChange(packageId, newStatus)                         │
│  │  │  ├─ PATCH /api/admin/custom-packages/{id}                        │
│  │  │  └─ Update packages state (real-time)                            │
│  │  │                                                                  │
│  │  ├─ setActiveTab(tab)                                                │
│  │  └─ setSelectedStatus(status)                                        │
│  │                                                                      │
│  └─ Computed Values:                                                    │
│     └─ filteredPackages = packages.filter(by selectedStatus)            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Layer 1: Authentication                                                │
│  ────────────────────────                                               │
│  ├─ Credentials validated against ENV variables                         │
│  ├─ Separate session cookies (admin_session)                            │
│  ├─ HTTP-only flag prevents JS access                                   │
│  └─ Secure flag in production (HTTPS only)                              │
│                                                                          │
│  Layer 2: Session Protection                                            │
│  ────────────────────────────                                           │
│  ├─ getAdminSession() validates cookie                                  │
│  └─ Null check returns 401 if invalid                                   │
│                                                                          │
│  Layer 3: API Protection                                                │
│  ────────────────────────                                               │
│  ├─ All admin endpoints check session first                             │
│  ├─ Unauthorized requests get 401 response                              │
│  ├─ Input validation on status updates                                  │
│  └─ Only valid statuses accepted                                        │
│                                                                          │
│  Layer 4: Route Protection                                              │
│  ────────────────────────────                                           │
│  ├─ Admin pages check session in useEffect                              │
│  ├─ Redirect to login if no admin session                               │
│  ├─ Prevents unauthorized access                                        │
│  └─ Router.push() redirects immediately                                 │
│                                                                          │
│  Layer 5: Data Protection                                               │
│  ────────────────────────────                                           │
│  ├─ Only admin can fetch user data                                      │
│  ├─ Only admin can fetch all packages                                   │
│  ├─ Only admin can update package status                                │
│  └─ Users only see their own data                                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Package Approval Process

```
┌──────────────────────────────────────────────────────────────────────────┐
│              COMPLETE PACKAGE APPROVAL WORKFLOW                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  STEP 1: USER SUBMITS PACKAGE WITH IMAGE                                │
│  ──────────────────────────────────────                                 │
│  User: /build-custom-package                                            │
│    1. Fill form                                                          │
│    2. Upload image                                                       │
│    3. Click "Submit"                                                     │
│    ↓                                                                     │
│    POST /api/custom-packages                                            │
│    ├─ Validate session (getSession)                                     │
│    ├─ Extract body: imageUrl included                                   │
│    ├─ Create request with imageUrl                                      │
│    └─ Store in database                                                 │
│                                                                          │
│  STEP 2: ADMIN REVIEWS PACKAGE                                          │
│  ──────────────────────────                                             │
│  Admin: /admin/dashboard                                                │
│    1. Load dashboard                                                     │
│    ↓                                                                     │
│    GET /api/admin/custom-packages                                       │
│    ├─ Validate admin session                                            │
│    ├─ Fetch all custom packages                                         │
│    ├─ Enrich with user details                                          │
│    └─ Return with images                                                │
│    ↓                                                                     │
│    2. Admin sees package card                                           │
│       ├─ User info displayed                                            │
│       ├─ Image preview shown                                            │
│       ├─ Details expandable                                             │
│       └─ Status: PENDING (yellow badge)                                 │
│    3. Admin reviews all information                                     │
│    4. Admin clicks "Approve" or "Reject"                                │
│                                                                          │
│  STEP 3: ADMIN UPDATES STATUS                                           │
│  ────────────────────────────                                           │
│    ↓                                                                     │
│    PATCH /api/admin/custom-packages/{id}                                │
│    ├─ Validate admin session                                            │
│    ├─ Validate status parameter                                         │
│    ├─ Update in database                                                │
│    └─ Return updated package                                            │
│    ↓                                                                     │
│    5. Front-end updates state                                           │
│       ├─ Package card status changes                                    │
│       ├─ Color badge updates (green/red)                                │
│       ├─ Buttons disappear                                              │
│       └─ Real-time update                                               │
│                                                                          │
│  STEP 4: USER SEES STATUS CHANGE                                        │
│  ──────────────────────────────                                         │
│  User Dashboard (next visit or real-time sync):                         │
│    ├─ Fetch their custom packages                                       │
│    ├─ See status changed to "Approved" or "Rejected"                    │
│    └─ Can view their uploaded image in request history                  │
│                                                                          │
│  COMPLETE FLOW ✅                                                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       TECHNOLOGY STACK                                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Frontend                        Backend                                │
│  ────────                        ───────                                │
│  • React 19                      • Next.js 16 (App Router)              │
│  • TypeScript                    • Node.js                              │
│  • Tailwind CSS                  • TypeScript                           │
│  • shadcn/ui                     • Next.js API Routes                   │
│  • React Hooks (useState, etc)   • HTTP-only Cookies                    │
│                                  • In-memory Database                    │
│  State Management                                                       │
│  ─────────────────                Features                              │
│  • React State (useState)        • Image Upload (Base64)                │
│  • React Context (implicit)      • Session Management                   │
│  • Real-time updates             • Input Validation                     │
│                                  • Error Handling                       │
│  Styling                                                                │
│  ───────                         Security                               │
│  • Tailwind Classes              • HTTP-only Cookies                    │
│  • Responsive Design             • CSRF Protection                      │
│  • Dark/Light Tokens             • Input Validation                     │
│                                  • Environment Secrets                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT CONFIGURATION                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Development (Local)                                                    │
│  ─────────────────────                                                  │
│  npm run dev → http://localhost:3000                                    │
│  ├─ Hot reload enabled                                                  │
│  ├─ Console logs visible                                                │
│  ├─ Demo credentials used                                               │
│  └─ In-memory database                                                  │
│                                                                          │
│  Production (Vercel)                                                    │
│  ───────────────────                                                    │
│  Environment Variables:                                                 │
│  ├─ ADMIN_EMAIL=your-admin@company.com                                  │
│  ├─ ADMIN_PASSWORD=your-secure-password                                 │
│  └─ NODE_ENV=production                                                 │
│                                                                          │
│  Deployment Steps:                                                      │
│  ├─ Push to GitHub                                                      │
│  ├─ Set env vars in Vercel dashboard                                    │
│  ├─ Deploy                                                              │
│  └─ Admin accessible at /admin/login                                    │
│                                                                          │
│  Future Enhancements:                                                   │
│  ├─ PostgreSQL database                                                 │
│  ├─ Cloud image storage (S3, Vercel Blob)                               │
│  ├─ Redis caching                                                       │
│  ├─ Email service integration                                           │
│  └─ CDN for static assets                                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Summary

**The admin management system includes:**
- ✅ Separate admin authentication layer
- ✅ Protected admin dashboard with dual tabs
- ✅ User data management and viewing
- ✅ Custom package request management
- ✅ Real-time status updates
- ✅ Image upload and display functionality
- ✅ Secure HTTP-only session management
- ✅ Environment-based credential configuration
- ✅ Responsive UI design
- ✅ Complete API protection

**All components work together to create a complete, secure, and user-friendly admin system for managing tourism packages and user data.**
