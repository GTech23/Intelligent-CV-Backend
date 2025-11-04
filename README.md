# Intelligent-CV API

## Overview
This project is a RESTful API backend for an intelligent CV builder application, built with Node.js and Express. It uses Mongoose as an ODM to interact with a MongoDB database for managing user accounts, resumes, and templates.

## Features
- **Express.js**: For building the robust and scalable RESTful API server.
- **MongoDB & Mongoose**: As the primary database and Object Data Modeling (ODM) library for storing and managing user, resume, and template data.
- **JSON Web Tokens (JWT)**: To handle secure, stateless user authentication and authorization.
- **Google Generative AI**: Integrated for AI-powered generation of resume content such as job responsibilities, summaries, and skills.
- **Handlebars & html-pdf-node**: For server-side rendering of resume templates into downloadable PDF documents.
- **Joi**: To perform validation on incoming request bodies, ensuring data integrity.
- **Nodemailer**: For sending transactional emails, including welcome messages and password reset instructions.

## Getting Started
### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/GTech23/Intelligent-CV-Backend.git
    cd Intelligent-CV-Backend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Create an environment file**
    Create a `.env` file in the root directory and add the environment variables listed below.

4.  **Start the development server**
    ```bash
    npm run dev
    ```

### Environment Variables
All required environment variables must be placed in a `.env` file in the project's root directory.

-   `PORT`: The port on which the server will run.
    -   Example: `PORT=8000`
-   `MONGODB_URI`: The connection string for your MongoDB database.
    -   Example: `MONGODB_URI=mongodb://localhost:27017/intelligent-cv-db`
-   `JWT_SECRET`: A secret key for signing and verifying JWTs.
    -   Example: `JWT_SECRET=your_super_secret_jwt_key_here`
-   `BASE_URL`: The base URL of the server.
    -   Example: `BASE_URL=http://localhost`
-   `BACKEND_URL`: The full backend URL, used for CORS configuration.
    -   Example: `BACKEND_URL=http://localhost:8000`
-   `EMAIL_USER`: The Gmail address used for sending emails.
    -   Example: `EMAIL_USER=youremail@gmail.com`
-   `EMAIL_PASS`: The Gmail App Password for the email account.
    -   Example: `EMAIL_PASS=yourapppassword`
-   `GEMINI_API_KEY`: Your API key for the Google Generative AI service.
    -   Example: `GEMINI_API_KEY=your_gemini_api_key`

## API Documentation
### Base URL
`/api`

### Endpoints
#### **Authentication (`/auth`)**
---
#### POST /auth/register
Registers a new user.

**Request**:
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "strongPassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User created successfully"
}
```

**Errors**:
-   `400 Bad Request`: Validation error (e.g., missing fields, weak password) or if the username/email already exists.
-   `500 Internal Server Error`: Server-side processing error.

---
#### POST /auth/login
Logs in an existing user and returns a JWT.

**Request**:
```json
{
  "email": "john.doe@example.com",
  "password": "strongPassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
-   `400 Bad Request`: Invalid credentials (email or password).
-   `500 Internal Server Error`: Server-side processing error.

---
#### GET /auth/profile
Retrieves the profile of the authenticated user. Requires an `Authorization: Bearer <token>` header.

**Request**:
-   Headers: `Authorization: Bearer <token>`

**Response**:
```json
{
  "data": {
    "id": "60d0fe4f5311236168a109ca",
    "email": "john.doe@example.com",
    "role": "user",
    "username": "johndoe"
  }
}
```

**Errors**:
-   `401 Unauthorized`: Authorization header is missing.
-   `400 Bad Request`: Invalid or expired token.

---
#### POST /auth/request_reset
Initiates a password reset process by sending an OTP to the user's email. Requires an `Authorization: Bearer <token>` header.

**Request**:
```json
{
  "email": "john.doe@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "You will receive an OTP to this email john.doe@example.com if the user exist"
}
```

**Errors**:
-   `404 Not Found`: User with the specified email does not exist (response message is generic to prevent enumeration).

---
#### POST /auth/verify-otp
Verifies the provided OTP and resets the user's password. Requires an `Authorization: Bearer <token>` header.

**Request**:
```json
{
  "email": "john.doe@example.com",
  "otp": "123456",
  "newPassword": "newStrongPassword456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Errors**:
-   `404 Not Found`: User not found.
-   `400 Bad Request`: Invalid/expired OTP, or the new password is the same as the old one.

#### **AI Content Generation (`/ai`)**
---
#### POST /ai
Generates a list of job responsibilities based on a job title.

**Request**:
```json
{
  "jobTitle": "Software Engineer"
}
```

**Response**:
```json
{
  "duties": [
    "Design, develop, and maintain software applications.",
    "Collaborate with cross-functional teams to define and ship new features.",
    "Write clean, scalable, and well-documented code."
  ]
}
```

**Errors**:
-   `500 Internal Server Error`: Error communicating with the generative AI service.

---
#### POST /ai/summary
Generates a list of professional summaries based on a job title.

**Request**:
```json
{
  "jobTitle": "Product Manager"
}
```

**Response**:
```json
{
  "objectives": [
    "Results-driven Product Manager with a proven track record of launching successful products.",
    "Strategic thinker with expertise in market analysis and product roadmap development."
  ]
}
```

**Errors**:
-   `500 Internal Server Error`: Error communicating with the generative AI service.

---
#### POST /ai/skills
Generates a list of relevant skills based on a job title.

**Request**:
```json
{
  "jobTitle": "Data Analyst"
}
```

**Response**:
```json
{
  "skills": [
    "SQL",
    "Python (Pandas, NumPy)",
    "Tableau",
    "Data Visualization",
    "Statistical Analysis"
  ]
}
```

**Errors**:
-   `500 Internal Server Error`: Error communicating with the generative AI service.

#### **Resume Management (`/resume`)**
All endpoints in this section require an `Authorization: Bearer <token>` header.

---
#### POST /resume
Creates a new resume for the authenticated user.

**Request**:
```json
{
    "templateId": "60d0fe4f5311236168a109cb",
    "personal": {
        "firstName": "John",
        "lastName": "Doe",
        "title": "Senior Software Engineer",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "address": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "postalCode": "12345",
        "country": "USA",
        "summary": "Experienced software engineer specializing in full-stack development."
    },
    "education": [
        {
            "school": "State University",
            "degree": "B.S. in Computer Science",
            "fieldOfStudy": "Computer Science",
            "graduationMonth": "May",
            "graduationYear": "2015"
        }
    ],
    "experience": [
        {
            "company": "Tech Solutions Inc.",
            "position": "Software Engineer",
            "startMonth": "June",
            "startYear": "2015",
            "endMonth": "Present",
            "endYear": "",
            "isCurrentlyWorking": true,
            "responsibilities": [
                "Developed and maintained web applications using React and Node.js.",
                "Collaborated with product teams to design new features."
            ]
        }
    ],
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "certifications": ["AWS Certified Developer"],
    "references": [
        {
            "firstName": "Jane",
            "lastName": "Smith",
            "company": "Tech Solutions Inc.",
            "jobTitle": "Engineering Manager",
            "email": "jane.smith@example.com"
        }
    ]
}
```

**Response**:
```json
{
  "message": "Resume created",
  "success": true
}
```

**Errors**:
-   `401 Unauthorized`: Invalid or missing token.
-   `500 Internal Server Error`: Failed to save the resume.

---
#### GET /resume
Retrieves all resumes created by the authenticated user.

**Request**:
-   Headers: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "count": 1,
  "resumes": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "userId": "60d0fe4f5311236168a109ca",
      "personal": { "firstName": "John", "lastName": "Doe" }
    }
  ]
}
```

**Errors**:
-   `404 Not Found`: No resumes found for the user.
-   `500 Internal Server Error`: Server error.

---
#### GET /resume/:id
Retrieves a single resume by its ID.

**Request**:
-   Headers: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "resume": {
    "_id": "60d0fe4f5311236168a109cc",
    "userId": "60d0fe4f5311236168a109ca",
    "personal": { "firstName": "John", "lastName": "Doe" },
    "...": "..."
  }
}
```

**Errors**:
-   `404 Not Found`: Resume with the specified ID not found or does not belong to the user.

---
#### PUT /resume/:id
Updates an existing resume by its ID.

**Request**:
(Payload can be a partial or full resume object)
```json
{
  "personal": {
    "title": "Lead Software Engineer"
  }
}
```

**Response**:
```json
{
  "message": "Resume updated",
  "success": true
}
```

**Errors**:
-   `404 Not Found`: Resume not found.

---
#### DELETE /resume/:id
Deletes a resume by its ID.

**Request**:
-   Headers: `Authorization: Bearer <token>`

**Response**:
```json
{
  "message": "Resume deleted",
  "success": true
}
```

**Errors**:
-   `500 Internal Server Error`: Failed to delete the resume.

---
#### POST /resume/:id/download
Generates and downloads a PDF of a resume using a specified template. The `:id` parameter refers to the **template ID**.

**Request**:
-   Headers: `Authorization: Bearer <token>`
-   Body: Full resume data object (see `POST /resume` for structure).

**Response**:
-   A PDF file stream with `Content-Type: application/pdf`.

**Errors**:
-   `404 Not Found`: Template with the specified ID not found.
-   `500 Internal Server Error`: PDF generation failed.

#### **Template Management (`/template`)**
---
#### GET /template
Retrieves a list of all available resume templates. No authentication required.

**Request**:
- (None)

**Response**:
```json
{
  "success": true,
  "templates": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Corporate",
      "previewUrl": "http://example.com/preview.png",
      "filePath": "corporate.hbs",
      "category": "Professional",
      "isPremium": false
    }
  ]
}
```

**Errors**:
-   `404 Not Found`: No templates are available in the database.

---
#### POST /template/create
Creates a new resume template. Requires Admin privileges.

**Request**:
-   Headers: `Authorization: Bearer <admin_token>`
-   Body:
    ```json
    {
      "name": "Modern Blue",
      "previewUrl": "http://example.com/modern_blue.png",
      "filePath": "modern-blue",
      "category": "Modern",
      "isPremium": false
    }
    ```

**Response**:
```json
{
  "success": true,
  "message": "Template created"
}
```

**Errors**:
-   `401 Unauthorized`: Token is missing or invalid.
-   `403 Forbidden`: User is not an administrator.

---
#### DELETE /template/:id
Deletes a template by its ID. Requires Admin privileges.

**Request**:
-   Headers: `Authorization: Bearer <admin_token>`

**Response**:
-   `200 OK` with no body content.

**Errors**:
-   `400 Bad Request`: Invalid template ID format.
-   `401 Unauthorized`: Token is missing or invalid.
-   `403 Forbidden`: User is not an administrator.
-   `404 Not Found`: Template with the specified ID does not exist.