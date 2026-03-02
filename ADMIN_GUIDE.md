# Admin Panel Guide

## Overview
The admin panel allows administrators to manage users, view custom package requests, and update package statuses with image support.

## Accessing the Admin Panel

1. Set your admin credentials as environment variables:
   ```bash
   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=your-secure-password
   ```
2. Navigate to `/admin/login`
3. Use your configured credentials to sign in

> Important: Admin credentials must be set via environment variables. No demo credentials are provided.

## Admin Dashboard Features

### 1. Users Tab
- View all registered users
- See user details:
  - Name
  - Email
  - Phone
  - Address
  - Member since date
- Users are displayed in a card grid format
- Non-searchable (for MVP)

### 2. Custom Packages Tab
- View all custom package requests from users
- Filter by status:
  - **All** - Show all requests
  - **Pending** - Requests awaiting review
  - **Approved** - Approved requests
  - **Rejected** - Rejected requests

#### Package Details Include:
- User information (name, email, phone, address)
- **Image Preview** - Displays the uploaded image if provided
- Base package title
- Request ID
- Current status
- Duration (days)
- Number of people
- Budget
- Custom places
- Selected food varieties
- Special requirements
- Request date

#### Package Management:
- **Expand/Collapse** - Click "Show Details" to view full package information
- **Status Update** - For pending packages:
  - **Approve Button** - Changes status to "approved"
  - **Reject Button** - Changes status to "rejected"
- Status badges indicate current state with color coding:
  - Yellow for pending
  - Green for approved
  - Red for rejected

### 3. Image Upload Feature
Users can upload images when requesting custom packages:
- **Supported formats:** PNG, JPG, GIF (up to 10MB)
- **Upload methods:**
  - Click to browse files
  - Drag and drop
- **Image preview** shown before submission
- Images are stored as base64 data URLs in the database
- Images are displayed in the admin dashboard for review

## API Endpoints

### Admin Authentication
- **POST** `/api/admin/login` - Admin login
- **POST** `/api/admin/logout` - Admin logout

### Admin Operations
- **GET** `/api/admin/users` - Get all users (requires admin session)
- **GET** `/api/admin/custom-packages` - Get all custom packages (requires admin session)
- **PATCH** `/api/admin/custom-packages/[id]` - Update package status (requires admin session)

### Image Upload
- **POST** `/api/upload` - Upload image (returns base64 data URL)

## Security Notes

- Admin endpoints require an active admin session
- Admin session cookies are HTTP-only for security
- Admin credentials should be updated via environment variables in production
- All admin operations are protected by session validation

## Workflow Example

1. Admin logs in with credentials
2. Admin navigates to "Custom Packages" tab
3. Admin filters to see "Pending" requests
4. Admin reviews package details and attached images
5. Admin clicks "Approve" or "Reject" to update status
6. Package status updates in real-time
7. Admin can track all approved/rejected requests

## Environment Variables (REQUIRED)

You MUST set these environment variables to enable admin access:

```bash
# .env.local (for local development)
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password

# For Vercel deployment, add these in Project Settings > Environment Variables
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

**Security Best Practices:**
- Use a strong, unique password (minimum 12 characters with mixed case, numbers, and symbols)
- Never commit credentials to version control
- Use different credentials for development and production
- Store credentials securely in your environment configuration

## Notes for Development

- Admin sessions are stored in HTTP-only cookies
- User sessions are separate from admin sessions
- Images are stored as base64 data URLs (suitable for MVP; consider using a CDN in production)
- All data is stored in-memory (suitable for MVP; use a database in production)
- **No demo credentials are embedded in the codebase** - all authentication requires environment variables
- If environment variables are not set, the admin login will return an error
