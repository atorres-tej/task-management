# Task Management API - Postman Collection Guide

This guide will help you set up and use the Postman collection to test the Task Management Backend API.

## Prerequisites

1. **Postman** installed on your computer
2. **Backend API** running on `http://localhost:7236`
3. **Frontend Application** running on `http://localhost:3000` (for authentication)

## Setup Instructions

### 1. Import the Collection

1. Open Postman
2. Click **Import** button
3. Paste the JSON collection provided
4. The collection will be imported with the name "Task Management Backend API"

### 2. Configure Environment Variables

The collection uses the following variables that are already configured:

- `backend_url`: `http://localhost:7236` (Backend API URL)
- `access_token`: Empty (You'll obtain this through authentication)
- `task_id`: `1` (Default task ID for testing)

## Getting an Access Token

Since the API uses Microsoft OAuth2 authentication, you need to obtain an access token through the frontend application:

### Method 1: Using the Frontend Application (Recommended)

1. **Start the Frontend Application**:
   ```bash
   cd your-frontend-app
   npm run dev
   ```

2. **Open Browser**: Navigate to `http://localhost:3000`

3. **Login with Microsoft**: Click the login button and authenticate with your Microsoft account

4. **Extract Token from Browser**:
   - Open **Developer Tools** (F12)
   - Go to **Application** tab → **Local Storage** → `http://localhost:3000`
   - Look for `authTokens` key
   - Copy the `accessToken` value

### Method 2: Using Browser Network Tab

1. **Open Frontend Application**: Navigate to `http://localhost:3000`
2. **Open Developer Tools** (F12) → **Network** tab
3. **Login**: Click login and complete Microsoft authentication
4. **Find Token Request**: Look for a request to `/api/auth/token`
5. **Copy Access Token**: From the response, copy the `tokens.accessToken` value

## Setting Up the Access Token in Postman

1. **Open Collection Variables**:
   - Right-click the collection → **Edit**
   - Go to **Variables** tab

2. **Set Access Token**:
   - Find the `access_token` variable
   - Paste your token in the **Current Value** field
   - Click **Save**

## Using the API Endpoints

### Authentication

All requests require the Bearer token which is automatically included via the collection's auth configuration.

### Available Endpoints

#### 1. Tasks

##### Get All Tasks
- **Method**: GET
- **Endpoint**: `/api/tasks`
- **Query Parameters** (optional):
  - `statusId`: Filter by status (e.g., 1)
  - `assignedTo`: Filter by user ID (e.g., 2)
  - `orderBy`: Sort field (e.g., DueDate)
  - `orderDir`: Sort direction (asc/desc)

##### Create Task
- **Method**: POST
- **Endpoint**: `/api/tasks`
- **Body**: JSON with task details
```json
{
  "title": "New Task",
  "description": "Task created via backend API",
  "assignedTo": 2,
  "dueDate": "2025-07-20T10:00:00Z"
}
```

##### Get Task by ID
- **Method**: GET
- **Endpoint**: `/api/tasks/{id}`
- **Note**: Uses the `task_id` variable (default: 1)

##### Update Task
- **Method**: PUT
- **Endpoint**: `/api/tasks/{id}`
- **Body**: JSON with updated task details
```json
{
  "title": "Updated Task",
  "description": "Task updated via backend API",
  "statusId": 2,
  "assignedTo": 1,
  "dueDate": "2025-07-25T15:00:00Z"
}
```

##### Delete Task
- **Method**: DELETE
- **Endpoint**: `/api/tasks/{id}`

#### 2. Task Statuses

##### Get All Task Statuses
- **Method**: GET
- **Endpoint**: `/api/task-statuses`
- **Description**: Returns available task statuses

#### 3. Users

##### Get All Users
- **Method**: GET
- **Endpoint**: `/api/users`
- **Description**: Returns list of users

