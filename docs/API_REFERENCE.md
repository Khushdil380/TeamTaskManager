# API Reference - Team Task Manager

## Base URL

\`http://localhost:5000/api\`

## Response Format

All responses are in JSON format:

\`\`\`json
{
"success": true,
"data": {},
"message": "Success message"
}
\`\`\`

---

## Authentication Endpoints

### Register User

- **Method:** POST
- **Endpoint:** \`/auth/signup\`
- **Headers:** Content-Type: application/json
- **Request Body:**
  \`\`\`json
  {
  "name": "string",
  "email": "string",
  "password": "string"
  }
  \`\`\`
- **Response:** User object with JWT token

### Login

- **Method:** POST
- **Endpoint:** \`/auth/login\`
- **Headers:** Content-Type: application/json
- **Request Body:**
  \`\`\`json
  {
  "email": "string",
  "password": "string"
  }
  \`\`\`
- **Response:** User object with JWT token

### Logout

- **Method:** POST
- **Endpoint:** \`/auth/logout\`
- **Headers:** Authorization: Bearer \<token\>
- **Response:** Success message

---

## Project Endpoints

### Get All Projects

- **Method:** GET
- **Endpoint:** \`/projects\`
- **Headers:** Authorization: Bearer \<token\>
- **Response:** Array of projects

### Create Project

- **Method:** POST
- **Endpoint:** \`/projects\`
- **Headers:** Authorization: Bearer \<token\>
- **Request Body:**
  \`\`\`json
  {
  "name": "string",
  "description": "string",
  "teamMembers": ["userId1", "userId2"]
  }
  \`\`\`

### Get Project Details

- **Method:** GET
- **Endpoint:** \`/projects/:id\`
- **Headers:** Authorization: Bearer \<token\>

### Update Project

- **Method:** PUT
- **Endpoint:** \`/projects/:id\`
- **Headers:** Authorization: Bearer \<token\>

### Delete Project

- **Method:** DELETE
- **Endpoint:** \`/projects/:id\`
- **Headers:** Authorization: Bearer \<token\>

---

## Task Endpoints

### Get All Tasks

- **Method:** GET
- **Endpoint:** \`/tasks\`
- **Headers:** Authorization: Bearer \<token\>

### Create Task

- **Method:** POST
- **Endpoint:** \`/tasks\`
- **Headers:** Authorization: Bearer \<token\>
- **Request Body:**
  \`\`\`json
  {
  "projectId": "string",
  "title": "string",
  "description": "string",
  "assignedTo": "userId",
  "dueDate": "ISO date",
  "priority": "low|medium|high"
  }
  \`\`\`

### Get Task Details

- **Method:** GET
- **Endpoint:** \`/tasks/:id\`
- **Headers:** Authorization: Bearer \<token\>

### Update Task

- **Method:** PUT
- **Endpoint:** \`/tasks/:id\`
- **Headers:** Authorization: Bearer \<token\>

### Delete Task

- **Method:** DELETE
- **Endpoint:** \`/tasks/:id\`
- **Headers:** Authorization: Bearer \<token\>

---

## Error Responses

\`\`\`json
{
"success": false,
"message": "Error message",
"error": "Detailed error information"
}
\`\`\`

### Common Status Codes

- 200 OK - Request successful
- 201 Created - Resource created
- 400 Bad Request - Invalid request
- 401 Unauthorized - No/invalid token
- 403 Forbidden - No permission
- 404 Not Found - Resource not found
- 500 Internal Server Error

---

## Authentication

Include JWT token in request headers:
\`\`\`
Authorization: Bearer <your_token_here>
\`\`\`

Token is valid for 7 days.

---

## Rate Limiting

- Coming soon

## Versioning

Current API Version: v1
