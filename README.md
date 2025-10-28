# Intelligent CV Backend API 🚀

## Overview
A robust Node.js Express API serving as the backend for an intelligent CV builder application, integrating MongoDB with Mongoose for data persistence, JWT for secure authentication, and Google Gemini AI for dynamic content generation. This project empowers users to create, manage, and download professional resumes with AI-assisted features.

## Features
*   **User Authentication**: Secure registration, login, and profile management using JSON Web Tokens (JWT).
*   **Resume Management**: Comprehensive CRUD (Create, Read, Update, Delete) operations for user-specific resumes.
*   **Dynamic Template Rendering**: Utilizes Handlebars to dynamically render various resume templates based on user data.
*   **AI Content Generation**: Leverages Google Gemini AI to generate job-specific bullet points and professional summaries for resumes.
*   **PDF Generation**: Seamlessly converts rendered HTML resumes into downloadable PDF documents.
*   **Role-Based Access Control**: Implements middleware for authorizing user and administrator roles, protecting sensitive routes.
*   **API Security**: Integrates `helmet` for HTTP header security and `cors` for managing cross-origin requests.

## Getting Started

### Installation
To get a copy of this project up and running on your local machine, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/GTech23/Intelligent-CV-Backend
    cd Intelligent-CV-Backend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Server**:
    ```bash
    npm run dev
    # Or for production
    npm start
    ```

### Environment Variables
This project requires the following environment variables to be set up in a `.env` file at the root of the project:

*   `PORT`: The port number on which the server will run.
    *   Example: `PORT=5000`
*   `MONGODB_URI`: Your MongoDB connection string.
    *   Example: `MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cvbuilder_db?retryWrites=true&w=majority`
*   `JWT_SECRET`: A secret key for signing and verifying JSON Web Tokens.
    *   Example: `JWT_SECRET=your_super_secret_jwt_key`
*   `GEMINI_API_KEY`: Your API key for accessing the Google Gemini Generative AI service.
    *   Example: `GEMINI_API_KEY=AIzaSyA_YOUR_GEMINI_API_KEY_HERE`
*   `BASE_URL`: The base URL of your application (for server logging purposes).
    *   Example: `BASE_URL=http://localhost`
*   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name for image uploads (if implemented for `personal.photoUrl`).
    *   Example: `CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name`
*   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
    *   Example: `CLOUDINARY_API_KEY=your_cloudinary_api_key`
*   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
    *   Example: `CLOUDINARY_API_SECRET=your_cloudinary_api_secret`


## Usage
The Intelligent CV Backend API provides a comprehensive set of endpoints for managing users, resumes, templates, and integrating AI for content generation.

**User Flow Example:**
1.  **Register as a new user** using the `/api/auth/register` endpoint.
2.  **Log in** via `/api/auth/login` to receive an authentication token.
3.  Use this token in the `Authorization: Bearer <token>` header for all authenticated requests.
4.  **Create a new resume** using `POST /api/resume`, providing personal details, desired template ID, and other resume sections.
5.  Optionally, **generate AI-powered bullet points or summaries** using the `/api/ai` endpoints to enrich your resume content.
6.  **View a resume** in a chosen template with `POST /api/resume/:id/view` (which returns HTML).
7.  **Download your resume as a PDF** using `POST /api/resume/:id/download`.

**Example API Call (Login):**
```bash
curl -X POST \
  http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Example API Call (Create Resume - requires `AUTH_TOKEN` from login):**
```bash
curl -X POST \
  http://localhost:5000/api/resume \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <AUTH_TOKEN>' \
  -d '{
    "templateId": "65b26b2b712b712b712b712b",
    "personal": {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "title": "Software Engineer"
    },
    "education": [
      {
        "school": "University of Tech",
        "degree": "B.Sc. Computer Science"
      }
    ]
  }'
```

## API Documentation

### Base URL
The base URL for all API endpoints is: `http://localhost:PORT/api` (or your deployed URL, e.g., `https://intelligent-cv-backend.onrender.com/api`)

### Endpoints

#### `POST /api/auth/register`
Creates a new user account.
**Request**:
```json
{
  "username": "newuser123",
  "email": "newuser@example.com",
  "password": "StrongPassword123"
}
```
**Response**:
```json
{
  "message": "User created successfully"
}
```
**Errors**:
- `400 Bad Request`: Validation failed (e.g., username too short, invalid email, password too weak).
- `400 Bad Request`: `username` or `email` already exists.
- `500 Internal Server Error`: Something went wrong on the server.

#### `POST /api/auth/login`
Authenticates a user and returns a JWT token.
**Request**:
```json
{
  "email": "user@example.com",
  "password": "UserPassword123"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```
**Errors**:
- `400 Bad Request`: Invalid credentials (email or password incorrect).
- `500 Internal Server Error`: Something went wrong on the server.

#### `GET /api/auth/profile`
Retrieves the authenticated user's profile. Requires `Authorization` header.
**Request**:
(No body)
**Response**:
```json
{
  "message": {
    "id": "65b26b2b712b712b712b712b",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "user",
    "iat": 1706263800,
    "exp": 1706271000
  }
}
```
**Errors**:
- `401 Unauthorized`: No `Authorization` header provided.
- `400 Bad Request`: Invalid or expired JWT token.
- `500 Internal Server Error`: Something went wrong on the server.

#### `POST /api/ai`
Generates job responsibilities/duties bullet points using AI.
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
    "Develop and maintain scalable web applications.",
    "Collaborate with cross-functional teams.",
    "Write clean, efficient, and well-documented code.",
    "Implement and manage RESTful APIs.",
    "Perform code reviews and mentor junior developers."
  ]
}
```
**Errors**:
- `500 Internal Server Error`: Error communicating with Gemini API or internal server issue.

#### `POST /api/ai/summary`
Generates career objectives or job summaries using AI.
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
    "Experienced Product Manager focused on delivering user-centric solutions.",
    "Results-driven leader with a passion for innovation and market growth.",
    "Strategic thinker skilled in product lifecycle management from concept to launch."
  ]
}
```
**Errors**:
- `500 Internal Server Error`: Error communicating with Gemini API or internal server issue.

#### `POST /api/resume`
Creates a new resume for the authenticated user. Requires `Authorization` header.
**Request**:
```json
{
  "templateId": "65b26b2b712b712b712b712b",
  "personal": {
    "firstName": "John",
    "lastName": "Doe",
    "title": "Full Stack Developer",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "summary": "Highly motivated developer with experience in Node.js and React."
  },
  "education": [
    {
      "school": "Tech University",
      "degree": "B.Sc. Computer Science",
      "graduationYear": "2020"
    }
  ],
  "skills": ["JavaScript", "Node.js", "React", "MongoDB"]
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
- `401 Unauthorized`: No `Authorization` header.
- `400 Bad Request`: Missing required fields or validation errors.
- `500 Internal Server Error`: Database error or other server issue.

#### `GET /api/resume`
Retrieves all resumes for the authenticated user. Requires `Authorization` header.
**Request**:
(No body)
**Response**:
```json
{
  "success": true,
  "count": 2,
  "resumes": [
    {
      "_id": "65b26b2b712b712b712b712a",
      "userId": "65b26b2b712b712b712b712b",
      "personal": { /* ... */ },
      "education": [ /* ... */ ],
      "skills": [ /* ... */ ]
    }
  ]
}
```
**Errors**:
- `401 Unauthorized`: No `Authorization` header.
- `404 Not Found`: No resumes found for the user.
- `500 Internal Server Error`: Database error.

#### `GET /api/resume/:id`
Retrieves a specific resume by its ID for the authenticated user. Requires `Authorization` header.
**Request**:
(No body)
**Response**:
```json
{
  "success": true,
  "resume": {
    "_id": "65b26b2b712b712b712b712a",
    "userId": "65b26b2b712b712b712b712b",
    "personal": { /* ... */ },
    "education": [ /* ... */ ],
    "skills": [ /* ... */ ]
  }
}
```
**Errors**:
- `401 Unauthorized`: No `Authorization` header.
- `404 Not Found`: Resume not found for the user or invalid ID format.
- `500 Internal Server Error`: Database error.

#### `PUT /api/resume/:id`
Updates a specific resume by its ID for the authenticated user. Requires `Authorization` header.
**Request**:
```json
{
  "personal": {
    "phone": "+1122334455",
    "linkedin": "https://linkedin.com/in/johndoe"
  },
  "experience": [
    {
      "company": "New Company",
      "position": "Senior Developer",
      "startMonth": "Jan",
      "startYear": "2022",
      "isCurrentlyWorking": true
    }
  ]
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
- `401 Unauthorized`: No `Authorization` header.
- `404 Not Found`: Resume not found for the user or invalid ID format.
- `500 Internal Server Error`: Database error or validation failure.

#### `DELETE /api/resume/:id`
Deletes a specific resume by its ID for the authenticated user. Requires `Authorization` header.
**Request**:
(No body)
**Response**:
```json
{
  "message": "Resume deleted",
  "success": true
}
```
**Errors**:
- `401 Unauthorized`: No `Authorization` header.
- `500 Internal Server Error`: Database error.

#### `POST /api/resume/:id/view`
Renders a resume using the specified template ID and provided resume data. Requires `Authorization` header.
**Request**:
(Full resume data object in the body, similar to `POST /api/resume`)
```json
{
  "personal": {
    "firstName": "John",
    "lastName": "Doe",
    "title": "Software Engineer",
    "email": "john.doe@example.com"
  },
  "education": [
    {
      "school": "University",
      "degree": "B.Sc.",
      "graduationYear": "2020"
    }
  ]
}
```
**Response**:
(HTML content of the rendered resume)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>John Doe - Resume</title>
    <!-- ... CSS styles ... -->
  </head>
  <body>
    <!-- Rendered HTML resume content -->
  </body>
</html>
```
**Errors**:
- `401 Unauthorized`: No `Authorization` header.
- `404 Not Found`: Template not found.
- `500 Internal Server Error`: Template rendering error.

#### `POST /api/resume/:id/download`
Generates and downloads a resume as a PDF file using the specified template ID and provided resume data. Requires `Authorization` header.
**Request**:
(Full resume data object in the body, similar to `POST /api/resume`)
```json
{
  "personal": {
    "firstName": "John",
    "lastName": "Doe",
    "title": "Software Engineer",
    "email": "john.doe@example.com"
  },
  "education": [
    {
      "school": "University",
      "degree": "B.Sc.",
      "graduationYear": "2020"
    }
  ]
}
```
**Response**:
(A downloadable PDF file)
**Errors**:
- `401 Unauthorized`: No `Authorization` header.
- `404 Not Found`: Resume or template not found.
- `500 Internal Server Error`: PDF generation failed.

#### `POST /api/template/create`
Creates a new resume template. Requires `Authorization` header and `admin` role.
**Request**:
```json
{
  "name": "Corporate Template",
  "previewUrl": "http://example.com/corporate-preview.png",
  "filePath": "corporate",
  "category": "Professional",
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
- `401 Unauthorized`: No `Authorization` header.
- `403 Forbidden`: User is not an administrator.
- `500 Internal Server Error`: Database error or validation failure.

#### `GET /api/template`
Retrieves all available resume templates.
**Request**:
(No body)
**Response**:
```json
{
  "success": true,
  "templates": [
    {
      "_id": "65b26b2b712b712b712b712c",
      "name": "Corporate Template",
      "previewUrl": "http://example.com/corporate-preview.png",
      "filePath": "corporate",
      "category": "Professional",
      "isPremium": false
    }
  ]
}
```
**Errors**:
- `404 Not Found`: No templates found.
- `500 Internal Server Error`: Database error.

#### `DELETE /api/template/:id`
Deletes a specific resume template by ID. Requires `Authorization` header and `admin` role.
**Request**:
(No body)
**Response**:
(200 OK with no body)
**Errors**:
- `401 Unauthorized`: No `Authorization` header.
- `403 Forbidden`: User is not an administrator.
- `400 Bad Request`: Invalid template ID format.
- `404 Not Found`: Template not found.
- `500 Internal Server Error`: Database error.

## Technologies Used

| Category        | Technology                                                                                                                       | Description                                                                                                                                              |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**     | [Node.js](https://nodejs.org/en/)                                                                                                | JavaScript runtime for server-side development.                                                                                                          |
|                 | [Express.js](https://expressjs.com/)                                                                                             | Fast, unopinionated, minimalist web framework for Node.js.                                                                                               |
| **Database**    | [MongoDB](https://www.mongodb.com/)                                                                                              | NoSQL database for flexible data storage.                                                                                                                |
|                 | [Mongoose](https://mongoosejs.com/)                                                                                              | MongoDB object data modeling (ODM) for Node.js.                                                                                                          |
| **Authentication** | [JSON Web Tokens (JWT)](https://jwt.io/)                                                                                       | Standard for securely transmitting information between parties as a JSON object.                                                                         |
|                 | [bcrypt](https://www.npmjs.com/package/bcrypt)                                                                                   | Library to help hash passwords.                                                                                                                          |
| **Validation**  | [Joi](https://joi.dev/)                                                                                                          | Powerful schema description language and data validator for JavaScript.                                                                                  |
| **Templating**  | [Handlebars.js](https://handlebarsjs.com/)                                                                                       | Minimal templating engine to generate HTML output from data.                                                                                             |
| **AI Integration** | [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)                                                      | Official Node.js client library for Google's Generative AI services (Gemini).                                                                            |
| **PDF Generation** | [html-pdf-node](https://www.npmjs.com/package/html-pdf-node)                                                                   | A Node.js wrapper for Puppeteer to convert HTML to PDF.                                                                                                  |
| **Security**    | [Helmet](https://helmetjs.github.io/)                                                                                            | Helps secure Express apps by setting various HTTP headers.                                                                                               |
|                 | [CORS](https://www.npmjs.com/package/cors)                                                                                       | Node.js CORS middleware.                                                                                                                                 |
| **Utilities**   | [dotenv](https://www.npmjs.com/package/dotenv)                                                                                   | Loads environment variables from a `.env` file.                                                                                                          |
|                 | [cookie-parser](https://www.npmjs.com/package/cookie-parser)                                                                     | Parse `Cookie` header and populate `req.cookies`.                                                                                                        |
|                 | [Multer](https://www.npmjs.com/package/multer)                                                                                   | Middleware for handling `multipart/form-data`, primarily used for uploading files (integrated for potential future image uploads).                         |
|                 | [Cloudinary](https://cloudinary.com/)                                                                                            | Cloud-based image and video management (integrated for potential `personal.photoUrl` storage).                                                           |

## Contributing
We welcome contributions to the Intelligent CV Backend API! If you have suggestions for improvements, new features, or bug fixes, please follow these guidelines:

1.  🍴 **Fork the repository** to your GitHub account.
2.  🌿 **Create a new branch** for your feature or fix.
    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  💻 **Make your changes** and ensure they adhere to the project's coding style.
4.  🧪 **Write and run tests** to ensure your changes work as expected and don't introduce regressions.
5.  ocommit your changes with a clear and concise commit message.
6.  🚀 **Push your branch** to your forked repository.
    ```bash
    git push origin feature/your-feature-name
    ```
7.  📝 **Open a Pull Request** against the `main` branch of the original repository. Provide a detailed description of your changes and why they are necessary.

## License
This project is licensed under the MIT License.

## Author Info

**GTech23**

*   Twitter: [Your Twitter Handle](https://twitter.com/GodstimePious)
*   Portfolio: [Your Portfolio Site](https://godstime-indol.vercel.app)

---

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Render Deploy](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)