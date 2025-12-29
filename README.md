# Node.js + Express Exam System Backend

This is a complete backend implementation for the online exam system, migrated from Python/Flask to Node.js + Express while maintaining the exact same API structure and functionality.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student, Admin)
- Secure password hashing with bcryptjs
- Token verification middleware

### Student Features
- Student registration and login
- View profile information
- View available exams
- Take exams and submit answers
- View results and detailed submissions
- Automatic grading for multiple-choice and numerical questions

### Admin Features
- Admin login (default: admin / admin123)
- Create and manage exams
- Add, update, and delete questions
- View exam results and statistics
- Grade essay questions manually
- View student information and statistics

### Question Types
- **Multiple Choice**: Auto-graded with correct answer matching
- **Numerical**: Auto-graded with exact answer matching
- **Essay**: Manual grading by admins with comments

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for all origins on API routes

## Project Structure

```
exam_backend_node/
├── config/
│   └── database.js          # Sequelize configuration
├── models/
│   ├── index.js             # Model registration and relationships
│   ├── Student.js           # Student model
│   ├── Admin.js             # Admin model
│   ├── Exam.js              # Exam model
│   ├── Question.js          # Question model
│   ├── Result.js            # Result model
│   ├── Submission.js        # Submission model
│   └── EssayGrade.js        # Essay grading model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── student.js           # Student routes
│   ├── exam.js              # Exam routes
│   └── admin.js             # Admin routes
├── utils/
│   ├── jwtHandler.js        # JWT token creation and verification
│   ├── authMiddleware.js    # Authentication middleware
│   └── autoGrader.js        # Auto-grading logic
├── app.js                   # Express app configuration
├── server.js                # Server entry point
├── package.json             # NPM dependencies
└── .env                     # Environment variables
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Navigate to the backend directory**:
   ```bash
   cd exam_backend_node
   ```

2. **Install dependencies** (already done if you ran the migration):
   ```bash
   npm install
   ```

3. **Configure environment** (optional):
   Edit `.env` file to change settings:
   ```env
   JWT_SECRET_KEY=your-secret-key-here
   DATABASE_URL=sqlite:./exam_system.db
   PORT=5000
   ```

## Running the Server

### Option 1: Using the batch file (Windows)
Double-click `start_node_backend.bat` in the root directory, or run:
```bash
start_node_backend.bat
```

### Option 2: Using npm
```bash
cd exam_backend_node
npm start
```

### Option 3: Direct Node.js
```bash
cd exam_backend_node
node server.js
```

The server will start on **http://localhost:5000**

## Default Admin Account

On first run, a default admin account is automatically created:
- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change this password in production!

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login (student or admin)
- `POST /api/auth/verify-token` - Verify JWT token

### Student Endpoints (`/api/students`)
All require student authentication (Bearer token).
- `GET /api/students/profile` - Get student profile
- `GET /api/students/results` - Get all results
- `GET /api/students/results/:resultId` - Get detailed result
- `GET /api/students/exams` - Get available exams

### Exam Endpoints (`/api/exams`)
- `GET /api/exams/:examId/questions` - Get exam questions (public)
- `POST /api/exams/:examId/submit` - Submit exam (requires student auth)

### Admin Endpoints (`/api/admin`)
All require admin authentication (Bearer token).
- `POST /api/admin/exams` - Create exam
- `POST /api/admin/exams/:examId/questions` - Add question
- `PUT /api/admin/exams/:examId/questions/:questionId` - Update question
- `DELETE /api/admin/exams/:examId/questions/:questionId` - Delete question
- `GET /api/admin/exams/:examId/results` - Get exam results
- `GET /api/admin/essay-reviews` - Get essay submissions for grading
- `POST /api/admin/essay-reviews/:submissionId/grade` - Grade essay
- `GET /api/admin/statistics` - Get statistics
- `GET /api/admin/students` - Get all students

## Database Schema

### Tables
- **students**: Student accounts and profiles
- **admins**: Admin accounts
- **exams**: Exam definitions
- **questions**: Questions belonging to exams
- **results**: Exam results for students
- **submissions**: Individual question answers
- **essay_grades**: Manual grades for essay questions

### Relationships
- Student → Results (one-to-many)
- Admin → Exams (one-to-many, as creator)
- Admin → EssayGrades (one-to-many, as grader)
- Exam → Questions (one-to-many, cascade delete)
- Exam → Results (one-to-many)
- Result → Submissions (one-to-many, cascade delete)
- Result → EssayGrades (one-to-many, cascade delete)

## Frontend Integration

The backend serves the frontend HTML files from the parent directory. Simply access:
- **http://localhost:5000** - Login page
- **http://localhost:5000/register.html** - Registration
- **http://localhost:5000/admin-dashboard.html** - Admin dashboard
- etc.

The backend prevents direct access to the `exam_backend_node` directory for security.

## Grading System

### Auto-Grading
- **Multiple-choice questions**: Automatically graded by comparing student answer with correct answer
- **Numerical questions**: Automatically graded with exact match
- **Points awarded**: Based on question.points value

### Manual Grading
- **Essay questions**: Initially scored as 0
- Admin must manually grade essays via the `/api/admin/essay-reviews` endpoints
- Final score = (auto_score + essay_score) / 2
- Result marked as "graded" only when all essays are graded

## Testing the Backend

### 1. Test Admin Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 2. Test Student Registration
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Student",
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Create an Exam (requires admin token)
```bash
POST http://localhost:5000/api/admin/exams
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Math Quiz",
  "description": "Basic math questions",
  "duration": 30,
  "passing_score": 70
}
```

## Differences from Python Backend

While the API structure and functionality are identical, here are the technical differences:

### Implementation
- **Python/Flask** → **Node.js/Express**
- **SQLAlchemy** → **Sequelize ORM**
- **Python bcrypt** → **bcryptjs** (compatible hashing)
- **Flask decorators** → **Express middleware**
- **Flask Blueprints** → **Express Routers**

### Files
- `app.py` → `app.js` + `server.js`
- `requirements.txt` → `package.json`
- `models/*.py` → `models/*.js`
- `routes/*.py` → `routes/*.js`
- `utils/*.py` → `utils/*.js`

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, change the PORT in `.env`:
```env
PORT=3000
```

### Database Issues
Delete `exam_system.db` and restart the server to recreate the database with default admin.

### CORS Issues
The backend is configured to allow all origins. If you need to restrict this, edit `app.js`:
```javascript
app.use(cors({
    origin: 'http://your-frontend-domain.com'
}));
```

## Production Deployment

1. Change the JWT secret key in `.env`
2. Use a production database (PostgreSQL, MySQL)
3. Enable HTTPS
4. Use environment variables for sensitive data
5. Enable logging
6. Set up proper error handling
7. Use a process manager like PM2

## License

This is an educational project for exam management.
