# InterVox Authentication System

## Overview

InterVox now has a complete, working authentication system with user registration and login that integrates with the backend database.

## Features

✅ **User Registration** - Sign up with email, password, full name, and phone
✅ **User Login** - Secure email/password authentication
✅ **JWT Tokens** - Secure token-based authentication stored in localStorage
✅ **Protected Routes** - Dashboard and interview routes require authentication
✅ **User Profiles** - Store and retrieve user data from database
✅ **Session Management** - Automatic token refresh and logout handling

## Setup

### Frontend Setup

1. **Create environment file:**
   ```bash
   cd Forntend
   cp .env.example .env.local
   ```

2. **Configure backend URL** in `.env.local`:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   # or
   pnpm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

2. **Configure environment** in `app/config.py`:
   - Ensure `DATABASE_URL` points to your database
   - Set `FRONTEND_URL` to match your frontend URL

3. **Run the server:**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

## User Flow

### Registration (New Users)

1. Click "Sign up for free" on the landing page or sign-in page
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (minimum 8 characters)
   - Phone (optional)
3. Confirm passwords match
4. Accept terms and conditions
5. Submit form
6. User is automatically logged in and redirected to dashboard

### Login (Existing Users)

1. Go to `/signin`
2. Enter email and password
3. Click "Sign In"
4. User is logged in and redirected to dashboard

### Logout

1. Go to `/logout` or click logout button in the app
2. Token is cleared from localStorage
3. User is redirected to home page

## Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Context API** - State management for auth
- **Tailwind CSS** - Styling
- **Motion** - Animations

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **SQLite** (development) / PostgreSQL (production) - Database
- **Passlib** - Password hashing
- **PyJWT** - JWT tokens
- **Pydantic** - Data validation

## API Endpoints

### Authentication Routes

**POST /api/auth/register**
- Register a new user
- Request body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepass123",
    "full_name": "John Doe",
    "phone": "+1 555-1234"
  }
  ```
- Returns: `{ access_token: string, token_type: "bearer" }`

**POST /api/auth/login**
- Login with email and password
- Request body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepass123"
  }
  ```
- Returns: `{ access_token: string, token_type: "bearer" }`

**GET /api/auth/me**
- Get current user profile
- Headers: `Authorization: Bearer <token>`
- Returns: User object with all profile data

**PUT /api/auth/me**
- Update user profile
- Headers: `Authorization: Bearer <token>`
- Request body: Any of `{ full_name, phone, target_role, experience_level, profile_picture_url }`
- Returns: Updated user object

**POST /api/auth/logout**
- Logout endpoint (client should remove token from localStorage)
- Returns: `{ message: "Logged out successfully..." }`

## File Structure

### Frontend
```
Forntend/src/app/
├── context/
│   └── AuthContext.tsx         # Auth state management
├── services/
│   └── authService.ts          # API calls to backend
├── components/
│   └── ProtectedRoute.tsx       # Route guard component
└── pages/
    ├── SignInPage.tsx          # Login page
    ├── SignUpPage.tsx          # Registration page
    ├── LogoutPage.tsx          # Logout handler
    └── DashboardLayout.tsx      # Protected dashboard
```

### Backend
```
Backend/app/
├── utils/
│   ├── auth.py                 # JWT verification
│   └── security.py             # Password hashing, token creation
├── models/
│   ├── database.py             # SQLAlchemy models
│   └── schemas.py              # Pydantic schemas
└── routers/
    └── auth.py                 # Authentication endpoints
```

## User Data Storage

All user information is securely stored in the database:

- **ID** - Unique identifier
- **Email** - Unique email address
- **Password Hash** - Bcrypt hashed password
- **Full Name** - User's name
- **Phone** - Optional phone number
- **Profile Picture** - Optional profile picture URL
- **Auth Provider** - 'email' or 'google' (OAuth)
- **Target Role** - Job role user is targeting
- **Experience Level** - User's experience level
- **Timestamp** - Account creation and last update time

## Security Features

- ✅ **Password Hashing** - Bcrypt with salt (72-byte limit)
- ✅ **JWT Tokens** - Stateless, expiring tokens (7-day duration)
- ✅ **CORS** - Properly configured for frontend
- ✅ **HTTPS Ready** - Works with HTTPS in production
- ✅ **Protected Routes** - Unauthorized access redirects to login
- ✅ **Token Storage** - Stored in localStorage (can be moved to secure cookies)

## Testing the Authentication System

### Test Registration
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "+1 555-0000"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <your_access_token>"
```

## Competitions Feature

The system is ready for competitions! User data is automatically stored and linked to competition participation through the database schema:

- **Competitions Table** - Stores competition metadata
- **CompetitionParticipation Table** - Links users to competitions
- **Interview Scores** - Linked to competitions for leaderboards
- **User Profiles** - Can be filtered by experience level, target role

## Next Steps

To integrate with competitions:

1. Users can now be filtered by registration data (email, experience_level, target_role)
2. Competition leaderboards can be built from interview scores
3. User rankings can be calculated based on total scores
4. Analytics can be generated from stored user data

## Troubleshooting

### "Login failed" error
- Check if backend is running on http://localhost:8000
- Verify email and password are correct
- Check browser console for detailed error messages

### Token not persisting
- Check if localStorage is enabled in browser
- Check if CORS headers are properly set on backend
- Verify token is being stored after login

### Can't access protected routes
- Ensure you're logged in (check localStorage for authToken)
- Try logging out and logging back in
- Check if token has expired (7-day expiration)

### Database errors on registration
- Ensure email hasn't been used before
- Check if database is properly initialized
- Check backend logs for SQL errors

## Production Deployment

Before deploying to production:

1. Set `VITE_API_BASE_URL` to your production backend URL
2. Change JWT_SECRET_KEY to a strong random value
3. Configure database to PostgreSQL
4. Set up proper CORS origins
5. Enable HTTPS
6. Consider using secure cookies instead of localStorage for tokens
7. Implement refresh token rotation
8. Add rate limiting to auth endpoints

## Support

For issues or questions:
- Check the backend console logs
- Check the browser DevTools Network tab
- Verify all services are running
- Check /api/health endpoint on backend

---

**Version**: 1.0.0
**Last Updated**: March 2026
