# Virtual Classroom Backend API Documentation

This document is a Swagger-style reference for the current backend routes.
It is intended for documentation and testing reference only.

---

## Base URL

- Development server: http://localhost:5000
- API prefix:
  - /api/auth
  - /api/course
  - /api/lecture
  - /api/user

---

## Authentication

Most protected routes use a JWT token stored in an HTTP-only cookie named `token`.

- Login or Google login sets the cookie automatically.
- Logout clears the cookie.

---

## 1. Auth API

### 1.1 Send OTP for registration
POST /api/auth/send-otp

Description:
Sends an OTP email to the user for signup verification.

Request body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Abc123!@#",
  "confirmPassword": "Abc123!@#"
}

Success response:
{
  "success": true,
  "message": "OTP sent successfully"
}

---

### 1.2 Verify OTP
POST /api/auth/verify-otp

Description:
Verifies the OTP sent to the user email.

Request body:
{
  "email": "john@example.com",
  "otp": "123456"
}

Success response:
{
  "success": true,
  "message": "Email verified successfully"
}

---

### 1.3 Login
POST /api/auth/login

Description:
Logs in a verified user and sets the auth cookie.

Request body:
{
  "email": "john@example.com",
  "password": "Abc123!@#"
}

Success response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "64...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profilePic": ""
  }
}

---

### 1.4 Logout
POST /api/auth/logout

Description:
Clears the auth cookie.

Success response:
{
  "success": true,
  "message": "Logged out successfully"
}

---

### 1.5 Google Login
POST /api/auth/google-login

Description:
Authenticates a user using Google ID token.

Request body:
{
  "idToken": "google-id-token"
}

Success response:
{
  "success": true,
  "message": "Google login successful",
  "user": {
    "id": "64...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profilePic": "https://..."
  }
}

---

## 2. Course API

### 2.1 Get all published courses
GET /api/course

Description:
Returns a paginated list of published courses.

Query params:
- page (optional, default: 1)
- limit (optional, default: 12)
- search (optional)

Success response:
{
  "success": true,
  "page": 1,
  "limit": 12,
  "total": 20,
  "totalPages": 2,
  "courses": [
    {
      "_id": "64...",
      "title": "React Mastery",
      "description": "Learn React from scratch",
      "price": 29,
      "thumbnail": "",
      "teacher": {
        "fullName": "Jane Smith",
        "profilePic": "",
        "email": "jane@example.com"
      }
    }
  ]
}

---

### 2.2 Get course by ID
GET /api/course/:id

Description:
Returns one course detail with its teacher and lectures.

Success response:
{
  "success": true,
  "course": {
    "_id": "64...",
    "title": "React Mastery",
    "description": "Learn React from scratch",
    "price": 29,
    "teacher": {
      "fullName": "Jane Smith",
      "profilePic": "",
      "email": "jane@example.com"
    },
    "lectures": [
      {
        "_id": "64...",
        "title": "Intro to JSX",
        "description": "...",
        "videoUrl": "https://..."
      }
    ]
  }
}

---

### 2.3 Create course
POST /api/course/create

Auth required: Yes

Request body:
{
  "title": "React Mastery",
  "description": "Learn React from scratch",
  "thumbnail": "https://example.com/thumb.jpg",
  "price": 29,
  "isPublished": true
}

Success response:
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "_id": "64...",
    "title": "React Mastery",
    "description": "Learn React from scratch",
    "price": 29,
    "teacher": "64..."
  }
}

---

### 2.4 Update course
PUT /api/course/:id

Auth required: Yes

Request body:
{
  "title": "Updated Course Name",
  "description": "Updated description",
  "price": 39,
  "isPublished": false
}

Success response:
{
  "success": true,
  "message": "Course updated successfully",
  "course": {}
}

---

### 2.5 Delete course
DELETE /api/course/:id

Auth required: Yes

Success response:
{
  "success": true,
  "message": "Course deleted successfully"
}

---

### 2.6 Get teacher-owned courses
GET /api/course/teacher/my-courses

Auth required: Yes

Success response:
{
  "success": true,
  "courses": []
}

---

### 2.7 Get enrolled courses for current user
GET /api/course/my/enrolled

Auth required: Yes

Success response:
{
  "success": true,
  "courses": []
}

---

### 2.8 Enroll in a course
POST /api/course/:id/enroll

Auth required: Yes

Success response:
{
  "success": true,
  "message": "Enrolled successfully",
  "course": {}
}

---

## 3. Lecture API

### 3.1 Create lecture
POST /api/lecture/:courseId

Auth required: Yes

Content-Type: multipart/form-data

Form fields:
- title: string
- description: string
- video: file

Success response:
{
  "success": true,
  "message": "Lecture created successfully",
  "lecture": {
    "_id": "64...",
    "title": "Intro to JSX",
    "description": "Intro lecture",
    "videoUrl": "https://...",
    "course": "64..."
  }
}

---

### 3.2 Update lecture
PUT /api/lecture/:lectureId

Auth required: Yes

Content-Type: multipart/form-data

Optional form fields:
- title: string
- description: string
- video: file

Success response:
{
  "success": true,
  "message": "Lecture updated successfully",
  "lecture": {}
}

---

### 3.3 Delete lecture
DELETE /api/lecture/:lectureId

Auth required: Yes

Success response:
{
  "success": true,
  "message": "Lecture deleted successfully"
}

---

## 4. User API

### 4.1 Get current user
GET /api/user/me

Auth required: Yes

Success response:
{
  "success": true,
  "user": {
    "_id": "64...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "enrolledCourses": [],
    "createdCourses": []
  }
}

---

### 4.2 Update profile
PUT /api/user/update-profile

Auth required: Yes

Request body:
{
  "fullName": "Updated Name",
  "profilePic": "https://example.com/avatar.png"
}

Success response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {}
}

---

### 4.3 Get enrolled courses
GET /api/user/enrolled-courses

Auth required: Yes

Success response:
{
  "success": true,
  "courses": []
}

---

### 4.4 Mark lecture complete
POST /api/user/complete-lecture

Auth required: Yes

Request body:
{
  "lectureId": "64..."
}

Success response:
{
  "success": true,
  "message": "Lecture marked as completed"
}

---

### 4.5 Get course progress
GET /api/user/progress/:courseId

Auth required: Yes

Success response:
{
  "success": true,
  "progress": 75,
  "completed": 3,
  "totalLectures": 4
}

---

### 4.6 Change password
PUT /api/user/change-password

Auth required: Yes

Request body:
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}

Success response:
{
  "success": true,
  "message": "Password updated successfully"
}

---

### 4.7 Delete account
DELETE /api/user/delete-account

Auth required: Yes

Success response:
{
  "success": true,
  "message": "Account deleted successfully"
}

---

## 5. Common Response Format

All routes generally return one of the following shapes:

Success:
{
  "success": true,
  "message": "...",
  "...": "..."
}

Error:
{
  "success": false,
  "message": "Error description"
}

---

## 6. Notes

- The signup flow currently uses OTP verification before account activation.
- Course and lecture routes are protected using the auth cookie.
- File uploads for lectures use multipart/form-data.
