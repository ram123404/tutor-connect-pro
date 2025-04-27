
# TutorConnectPro - Home Tuition Management Platform

A complete home tuition management platform that connects students with tutors for personalized learning experiences.

## Features

### For Students/Parents
- Register and create student profiles
- Search for tutors by subject, location, and experience
- Send tuition requests to selected tutors
- Track request statuses
- Manage active and completed bookings
- Extend bookings for additional months

### For Tutors
- Register and create tutor profiles with subjects, experience, and availability
- Receive tuition requests from students
- Accept or reject tuition requests
- View active bookings and schedules

### For Admins
- Monitor all platform users and tuition requests
- Block/unblock users when necessary
- Access comprehensive dashboard with platform statistics

## Tech Stack

### Frontend
- React (with TypeScript)
- React Router for navigation
- TailwindCSS for styling
- Shadcn UI component library
- React Hook Form for form management
- Zod for form validation
- React Query for data fetching
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Role-based access control

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables by editing the `.env` file:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=30d
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update the API URL in `src/config.ts` if your backend isn't running on the default port:
   ```typescript
   export const config = {
     apiBaseUrl: 'http://localhost:5000/api',
   };
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Access the application at `http://localhost:5173`

## System Architecture

The application follows a typical client-server architecture:

- **Frontend**: React application handling UI rendering and client-side logic
- **Backend**: Express server handling API requests, business logic, and database operations
- **Database**: MongoDB storing all application data in structured collections

### API Routes

- **Auth Routes**:
  - POST `/api/auth/register`
  - POST `/api/auth/login`

- **User Routes**:
  - GET `/api/users/me`
  - PUT `/api/users/update`

- **Tutor Routes**:
  - GET `/api/tutors`
  - GET `/api/tutors/:id`
  - PUT `/api/tutors/:id` (profile update)

- **Tuition Request Routes**:
  - POST `/api/requests`
  - GET `/api/requests`
  - PUT `/api/requests/:id/accept`
  - PUT `/api/requests/:id/reject`
  - POST `/api/requests/extend` (for booking extensions)

- **Admin Routes**:
  - GET `/api/admin/users`
  - GET `/api/admin/requests`
  - PUT `/api/admin/users/:id/block`

## Database Models

- **User**: Basic information for both students and tutors
- **TutorProfile**: Tutor-specific information
- **TuitionRequest**: Tuition request details
- **Booking**: Active booking details including session scheduling

## License

This project is proprietary and not licensed for public use.
