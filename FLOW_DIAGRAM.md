# Complete Flow Diagram

## Enquiry Flow (NEW!)

```
USER SIDE
├─ User logs in
├─ Fills enquiry form on package page
├─ Submits enquiry
│  └─ POST /api/enquiries
│     ├─ Check user session
│     ├─ Save to database
│     └─ Return enquiry details
├─ Enquiry appears in user's dashboard
└─ Waits for admin response

ADMIN SIDE
├─ Admin logs in with credentials
├─ Goes to Admin Dashboard
├─ Clicks "Enquiries" tab
├─ Sees ALL enquiries with:
│  ├─ User name & email
│  ├─ Phone number
│  ├─ Travel date
│  ├─ Party size
│  ├─ Message
│  ├─ Enquiry date
│  └─ Current status
├─ Can view enquiry details
└─ Track which enquiries need response

Database Stores
└─ enquiries map
   ├─ enquiry_id_1: {userId, packageId, date, status, ...}
   ├─ enquiry_id_2: {...}
   └─ enquiry_id_N: {...}
```

---

## Custom Package Approval Flow

```
USER SIDE
├─ User logs in
├─ Creates custom package request
│  ├─ Select locations
│  ├─ Upload image
│  ├─ Add special requirements
│  └─ Submit
└─ Package appears in dashboard with "Pending" status

   ↓↓↓ REQUEST GOES TO ADMIN ↓↓↓

ADMIN SIDE
├─ Admin Dashboard loads
├─ "Custom Packages" tab shows request
├─ Admin sees:
│  ├─ User details (name, email, phone)
│  ├─ Requested locations
│  ├─ Uploaded image preview
│  ├─ Budget & duration
│  ├─ Status: "Pending"
│  ├─ "Approve" button
│  └─ "Reject" button
├─ Admin clicks "Approve"
│  └─ PUT /api/admin/custom-packages/[id]
│     ├─ Check admin session ✓
│     ├─ Update status to "approved"
│     ├─ Save to database
│     ├─ Return updated package
│     └─ Admin dashboard refreshes
├─ Package now shows "Approved" status
└─ Admin moves on to next request

   ↓↓↓ STATUS CHANGED IN DATABASE ↓↓↓

USER SIDE
├─ User's dashboard still shows "Pending"
├─ User refreshes page
│  └─ GET /api/custom-packages
│     ├─ Fetch all user's packages
│     ├─ Return with "approved" status
│     └─ Dashboard updates
├─ User sees "Approved" status
└─ User can proceed with approved package

Database Stores
└─ customPackageRequests map
   ├─ pkg_id_1: {userId, status: "approved", imageUrl, ...}
   ├─ pkg_id_2: {...}
   └─ pkg_id_N: {...}
```

---

## Admin Authentication Flow

```
FIRST TIME SETUP
├─ Create .env.local file
├─ Add:
│  ├─ ADMIN_EMAIL=admin@example.com
│  └─ ADMIN_PASSWORD=SecurePassword123
└─ Restart dev server

LOGIN FLOW
├─ Visit /admin/login page
├─ Form shows:
│  ├─ Email input field
│  ├─ Password input field
│  └─ Sign In button
├─ User enters:
│  ├─ admin@example.com
│  └─ SecurePassword123
├─ Click "Sign In"
│  └─ POST /api/admin/login
│     ├─ Read email & password from request
│     ├─ Get ADMIN_EMAIL from env variable
│     ├─ Get ADMIN_PASSWORD from env variable
│     ├─ Compare: admin@example.com === env.ADMIN_EMAIL ✓
│     ├─ Compare: SecurePassword123 === env.ADMIN_PASSWORD ✓
│     ├─ If MISMATCH: Return error "Invalid credentials"
│     ├─ If MATCH:
│     │  ├─ Create admin session
│     │  ├─ Set HTTP-only cookie
│     │  └─ Return success
│     └─ Redirect to /admin/dashboard
├─ Admin Dashboard loads
├─ Checks for admin session
│  └─ GET /api/auth/session
│     ├─ Check admin_session cookie
│     ├─ If invalid: Redirect to login
│     └─ If valid: Continue
├─ Fetches data:
│  ├─ GET /api/admin/users
│  ├─ GET /api/admin/custom-packages
│  └─ GET /api/admin/enquiries
├─ Dashboard renders 3 tabs:
│  ├─ Users Tab
│  ├─ Custom Packages Tab
│  └─ Enquiries Tab
└─ Admin can now manage everything
```

---

## Data Update Flow (Real-Time)

```
SCENARIO: Admin approves package, user should see it

Step 1: Admin Action
├─ Admin clicks "Approve" button
│  └─ PUT /api/admin/custom-packages/[id]
│     ├─ status: "pending" → "approved"
│     ├─ Database updated
│     └─ Return updated package
├─ Admin dashboard immediately shows "Approved"
└─ Task complete on admin side

Step 2: Database State
├─ In-memory database (Map):
│  ├─ Before: {id: pkg_1, status: "pending", ...}
│  └─ After: {id: pkg_1, status: "approved", ...}
└─ Change is permanent (until page refresh for MVP)

Step 3: User Discovers Update
├─ User is on dashboard (still shows "pending")
├─ User refreshes page (F5 or reload button)
│  └─ GET /api/custom-packages
│     ├─ Fetch from database
│     ├─ Find package: status "approved"
│     └─ Return to user
├─ Dashboard updates
├─ User sees "Approved" status
└─ User happy! ✓
```

---

## Enquiry Visibility Flow

```
DATABASE STRUCTURE
└─ enquiries map (in-memory)
   ├─ enquiry_1: {
   │  ├─ id: "enquiry-1234567890",
   │  ├─ userId: "user-123",
   │  ├─ packageId: "pkg-1",
   │  ├─ numberOfPeople: 4,
   │  ├─ travelDate: "2026-05-15",
   │  ├─ message: "Is this available in May?",
   │  ├─ status: "pending",
   │  └─ createdAt: Date(2026-02-25)
   │  }
   ├─ enquiry_2: {...}
   └─ enquiry_N: {...}

USER DASHBOARD
├─ GET /api/enquiries
│  └─ getEnquiriesByUser(userId)
│     ├─ Filter: only enquiries where userId matches
│     ├─ Return: [enquiry_1, enquiry_2, ...]
│     └─ User sees ONLY their enquiries
├─ Display in "Enquiries" tab
└─ User sees their own enquiries

ADMIN DASHBOARD
├─ GET /api/admin/enquiries
│  └─ getAllEnquiries()
│     ├─ Return: ALL enquiries from database
│     ├─ No filtering by userId
│     ├─ Return ALL: [enquiry_1, enquiry_2, ..., enquiry_N]
│     └─ Admin sees EVERYONE'S enquiries
├─ Display in "Enquiries" tab
├─ Show user info for each enquiry:
│  ├─ Get user from users map
│  ├─ Join with: name, email, phone
│  └─ Display together
└─ Admin sees everything
```

---

## Image Upload Flow (When User Creates Custom Package)

```
USER CREATES PACKAGE WITH IMAGE
├─ User selects image file
├─ Preview shown in form
├─ User clicks submit
├─ Form submission:
│  ├─ POST /api/upload
│  │  ├─ Receive image file
│  │  ├─ Convert to base64
│  │  ├─ Return imageUrl
│  │  └─ Store in component state
│  └─ Include imageUrl in package request
├─ POST /api/custom-packages
│  ├─ Save with imageUrl
│  └─ Store in database
└─ Database now has: {id, userId, imageUrl, ...}

ADMIN VIEWS IMAGE
├─ Admin dashboard loads custom packages
├─ For each package:
│  ├─ Check if imageUrl exists
│  ├─ If yes: Display image thumbnail
│  ├─ If no: Show placeholder
│  └─ Image visible on card
└─ Admin can see what user uploaded

USER VIEWS THEIR PACKAGE
├─ User dashboard shows their custom packages
├─ If package has imageUrl:
│  ├─ Display image in package card
│  └─ Shows what they uploaded
└─ Visual reference to their request
```

---

## Session Management Flow

```
USER SESSION
├─ Cookies:
│  └─ tourism_session: {userId, email, name}
│     ├─ HTTP-only: Yes (can't access from JS)
│     ├─ Secure: Yes (only over HTTPS in production)
│     ├─ Expires: 7 days
│     └─ Used by: All user pages/APIs
└─ Verified by: getSession() function

ADMIN SESSION  
├─ Cookies:
│  └─ admin_session: {adminId, email}
│     ├─ HTTP-only: Yes
│     ├─ Secure: Yes
│     ├─ Expires: 7 days
│     └─ Used by: All admin pages/APIs
└─ Verified by: getAdminSession() function

SESSION VALIDATION FLOW
├─ User visits protected page
├─ Check for session cookie
├─ If found:
│  ├─ Parse and validate
│  ├─ If valid: Allow access ✓
│  └─ If invalid: Redirect to login
└─ If not found:
   └─ Redirect to login

LOGOUT FLOW
├─ User clicks Logout button
│  └─ DELETE cookie
│     ├─ Remove tourism_session
│     ├─ Clear user data
│     └─ Redirect to login
└─ Next page visit requires new login
```

---

## Error Handling Flow

```
ADMIN LOGIN ERROR
├─ User submits invalid credentials
│  └─ POST /api/admin/login
│     ├─ Check: email matches env.ADMIN_EMAIL
│     ├─ Check: password matches env.ADMIN_PASSWORD
│     ├─ If either wrong: Return 401 "Invalid credentials"
│     └─ If both wrong: Return 401 "Invalid credentials"
├─ Form shows error message
├─ User can retry
└─ No session created (user stays logged out)

UNAUTHORIZED ADMIN ACCESS
├─ User tries to access /api/admin/enquiries
│  └─ GET /api/admin/enquiries
│     ├─ Check admin session
│     ├─ If missing/invalid: Return 401 "Unauthorized"
│     └─ Block API call
├─ Frontend redirects to login
└─ User must login as admin

ENQUIRY NOT FOUND
├─ Admin tries to update non-existent enquiry
│  └─ PUT /api/admin/enquiries/[id]
│     ├─ Query: enquiries.get(id)
│     ├─ If null: Return 404 "Enquiry not found"
│     └─ If found: Update and return
├─ Frontend shows error
└─ Admin can try another enquiry

FIREBASE NOT CONFIGURED
├─ App starts without Firebase env vars
├─ Firebase initialization:
│  ├─ Check: env variables set
│  ├─ If not: Use fallback config
│  ├─ Log warning to console
│  └─ Continue with fallback
├─ App still works perfectly
└─ User doesn't notice (fallback handles it)
```

---

This shows how every piece fits together. All interactions follow these flows! 🔄
