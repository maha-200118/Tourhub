# Admin Panel - Quick Start

## 🚀 Get Started in 2 Minutes

### Step 1: Access Admin Login
Navigate to: **http://localhost:3000/admin/login**

### Step 2: Use Demo Credentials
```
Email: admin@tourism.com
Password: admin123
```

### Step 3: You're In!
You now have access to:
- ✅ View all registered users
- ✅ Review custom package requests with images
- ✅ Approve or reject requests
- ✅ Filter requests by status

---

## 📊 Dashboard Overview

### Users Tab
- **See All Users**: Names, emails, phone numbers, addresses
- **Cards Layout**: Easy-to-scan user information
- **Join Dates**: See when users registered

### Custom Packages Tab
- **Filter by Status**:
  - All (total requests)
  - Pending (waiting for review)
  - Approved (accepted requests)
  - Rejected (declined requests)

- **Review Packages**:
  - 👤 User details
  - 🖼️ **Image preview** (if user uploaded one)
  - 📍 Custom places they want to visit
  - 🍽️ Food preferences
  - 💰 Budget
  - 👥 Number of people
  - ⏱️ Duration
  - ✨ Special requirements

- **Take Action**:
  - **Approve** ✅ (turns to green)
  - **Reject** ❌ (turns to red)

---

## 🖼️ Image Feature

Users can now upload images when creating custom packages:

**For Users**:
1. Go to "Build Custom Package"
2. Fill in all details
3. **Click to upload an image** (optional)
4. See preview
5. Submit

**For Admins**:
- See the uploaded images in the dashboard
- Review images before approving/rejecting
- Images displayed in full size for inspection

---

## 🔒 Navigation

**From Home Page**:
- Not logged in? → Click "Admin" button → Go to admin login

**In Admin Dashboard**:
- Click "Logout" → Returns to home page

---

## 💡 Common Tasks

### See All Users
1. Dashboard → Users tab
2. Scroll through user cards
3. View all details on each card

### Review a Custom Package Request
1. Dashboard → Custom Packages tab
2. See request card with user info
3. See image if uploaded
4. Click "Show Details" to expand
5. Review all package specifications

### Approve a Request
1. Find pending request
2. Click "Approve" button
3. Status changes to green ✅
4. Request moves to "Approved" filter

### Reject a Request
1. Find pending request
2. Click "Reject" button
3. Status changes to red ❌
4. Request moves to "Rejected" filter

### Filter by Status
1. Custom Packages tab
2. Click status filter buttons at top
3. View only: All / Pending / Approved / Rejected

---

## 🎨 What the Interface Shows

### For Each Custom Package:

```
┌─────────────────────────────────────┐
│  Custom Worldwide Tour - [Countries]│  ← Package title
│  ID: custom-123456789              │  ← Request ID
│                          [Status]   │  ← Color-coded status
├─────────────────────────────────────┤
│ 👤 User Details                     │
│   Name: John Doe                    │
│   Email: john@example.com           │
│   Phone: 555-1234                   │
│   Address: 123 Main St              │
├─────────────────────────────────────┤
│ 🖼️  [Image Preview]                 │
│     (If user uploaded one)          │
├─────────────────────────────────────┤
│ [Show Details]                      │  ← Click to expand
│ [Approve] [Reject]                  │  ← Action buttons
└─────────────────────────────────────┘
```

---

## ⚙️ Customization

### Change Admin Credentials
Create or update `.env.local`:
```env
ADMIN_EMAIL=your-email@company.com
ADMIN_PASSWORD=your-secure-password
```

Then restart your app.

---

## 🔗 Quick Links

- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`
- **Home**: `/`
- **Build Custom Package**: `/build-custom-package` (requires user login)
- **User Dashboard**: `/dashboard` (requires user login)

---

## 📝 Tips

✅ **Best Practices**:
- Review all package details before approving
- Check images carefully
- Use filters to organize your workflow
- Approve requests promptly to improve user experience

❌ **What NOT To Do**:
- Don't approve without reviewing user details
- Don't skip checking uploaded images
- Don't reject without considering all requirements

---

## 🆘 Troubleshooting

**Can't see custom packages?**
- Make sure you're logged in as admin
- Try refreshing the page
- Check that users have submitted packages

**Images not showing?**
- Make sure users uploaded images when creating packages
- Try a different browser
- Check browser console for errors

**Can't change status?**
- Only pending packages can be approved/rejected
- Make sure you're logged in
- Try refreshing the page

---

## 🎯 Next Steps

1. ✅ Login to admin panel
2. ✅ Explore Users tab
3. ✅ Check Custom Packages tab
4. ✅ Review some packages
5. ✅ Try approving/rejecting
6. ✅ Filter by different statuses
7. ✅ Test image viewing

**Done!** You're now a TourHub Admin! 🎉

---

**Questions?** Check out `ADMIN_GUIDE.md` for detailed documentation.
