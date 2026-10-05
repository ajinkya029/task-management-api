# 📋 Task Management API — Trello/Jira Clone

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.x-880000?style=for-the-badge\&logo=mongoose\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![bcrypt](https://img.shields.io/badge/bcrypt-Password_Hashing-4285F4?style=for-the-badge)
![REST API](https://img.shields.io/badge/API-REST-FF6C37?style=for-the-badge)

A robust **RESTful Task Management API** inspired by applications like **Trello and Jira**, built with the **MERN stack**.

The API provides authentication, boards, members, lists, tasks, task assignments, priorities, statuses, labels, due dates, filtering, and access control — providing a solid backend foundation for a modern project management application.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration
* User login
* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Get authenticated user
* Board-level access control

### 📋 Board Management

* Create boards
* View accessible boards
* View complete board details
* Update boards
* Archive boards
* Delete boards
* Board owners
* Board members
* Add/remove members

### 📝 List Management

* Create lists
* Update lists
* Delete lists
* Position-based ordering
* Lists belong to specific boards

### ✅ Task Management

* Create tasks
* View individual tasks
* Update tasks
* Delete tasks
* Assign tasks to multiple users
* Task descriptions
* Due dates
* Labels
* Position-based ordering

### 🎯 Task Priorities

Tasks support four priority levels:

```text
low
medium
high
urgent
```

### 📊 Task Status

Tasks support three workflow states:

```text
todo
in_progress
done
```

### 🔎 Task Filtering

Tasks can be filtered by:

* Board
* List
* Status
* Priority
* Assignee

Example:

```http
GET /api/tasks?boardId=BOARD_ID&status=in_progress
```

---

# 🛠️ Tech Stack

| Technology     | Purpose               |
| -------------- | --------------------- |
| **Node.js**    | JavaScript runtime    |
| **Express.js** | REST API framework    |
| **MongoDB**    | NoSQL database        |
| **Mongoose**   | MongoDB ODM           |
| **JWT**        | Authentication        |
| **bcryptjs**   | Password hashing      |
| **CORS**       | Cross-origin requests |
| **Morgan**     | HTTP request logging  |
| **Nodemon**    | Development server    |

---

# 📁 Project Structure

```text
task-management-api/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Board.js
│   │   ├── List.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── boardRoutes.js
│   │   ├── listRoutes.js
│   │   └── taskRoutes.js
│   │
│   └── utils/
│       ├── access.js
│       └── token.js
│
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── Task-Management-API.postman_collection.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/ajinkya029/task-management-api.git
```

Navigate into the project:

```bash
cd task-management-api
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file based on `.env.example`.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_management
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### MongoDB Atlas

You can also use MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task_management
```

---

# ▶️ Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The API will run at:

```text
http://localhost:5000
```

---

# ❤️ Health Check

Verify that the server is running:

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "Task Management API is running"
}
```

---

# 🔐 Authentication API

## Register

```http
POST /api/auth/register
```

Request:

```json
{
  "name": "Ajinkya",
  "email": "ajinkya@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Ajinkya",
    "email": "ajinkya@example.com",
    "avatar": ""
  }
}
```

---

## Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "ajinkya@example.com",
  "password": "password123"
}
```

---

## Get Current User

```http
GET /api/auth/me
```

Header:

```http
Authorization: Bearer JWT_TOKEN
```

---

# 👤 User API

## Search Users

```http
GET /api/users/search?q=ajinkya
```

Authentication required.

This endpoint is useful when adding users to a board or assigning tasks.

---

# 📋 Board API

| Method   | Endpoint                          | Description           |
| -------- | --------------------------------- | --------------------- |
| `GET`    | `/api/boards`                     | Get accessible boards |
| `POST`   | `/api/boards`                     | Create board          |
| `GET`    | `/api/boards/:id`                 | Get board details     |
| `PATCH`  | `/api/boards/:id`                 | Update board          |
| `DELETE` | `/api/boards/:id`                 | Delete board          |
| `POST`   | `/api/boards/:id/members`         | Add member            |
| `DELETE` | `/api/boards/:id/members/:userId` | Remove member         |

### Create Board

```http
POST /api/boards
```

```json
{
  "title": "Website Redesign",
  "description": "Project management board",
  "background": "#2563eb"
}
```

---

# 👥 Add Board Member

```http
POST /api/boards/:id/members
```

Request:

```json
{
  "userId": "USER_OBJECT_ID"
}
```

Only the board owner can manage members.

---

# 📝 List API

| Method   | Endpoint         | Description |
| -------- | ---------------- | ----------- |
| `POST`   | `/api/lists`     | Create list |
| `PATCH`  | `/api/lists/:id` | Update list |
| `DELETE` | `/api/lists/:id` | Delete list |

### Create List

```http
POST /api/lists
```

```json
{
  "title": "In Progress",
  "boardId": "BOARD_OBJECT_ID",
  "position": 1
}
```

The `position` property allows the frontend to implement drag-and-drop ordering.

---

# ✅ Task API

| Method   | Endpoint                 | Description     |
| -------- | ------------------------ | --------------- |
| `GET`    | `/api/tasks?boardId=...` | Get board tasks |
| `POST`   | `/api/tasks`             | Create task     |
| `GET`    | `/api/tasks/:id`         | Get task        |
| `PATCH`  | `/api/tasks/:id`         | Update task     |
| `DELETE` | `/api/tasks/:id`         | Delete task     |

---

## Create Task

```http
POST /api/tasks
```

```json
{
  "title": "Build authentication UI",
  "description": "Create login and registration screens",
  "boardId": "BOARD_OBJECT_ID",
  "listId": "LIST_OBJECT_ID",
  "position": 0,
  "priority": "high",
  "status": "in_progress",
  "dueDate": "2026-10-15T18:30:00.000Z",
  "labels": [
    "frontend",
    "authentication"
  ],
  "assignees": [
    "USER_OBJECT_ID"
  ]
}
```

---

# 🔎 Task Filtering

### Filter by Status

```http
GET /api/tasks?boardId=BOARD_ID&status=in_progress
```

### Filter by Priority

```http
GET /api/tasks?boardId=BOARD_ID&priority=high
```

### Filter by Assignee

```http
GET /api/tasks?boardId=BOARD_ID&assignee=USER_ID
```

### Filter by List

```http
GET /api/tasks?boardId=BOARD_ID&listId=LIST_ID
```

Multiple filters can be combined:

```http
GET /api/tasks?boardId=BOARD_ID&status=todo&priority=urgent
```

---

# 🔄 Example Workflow

A typical Trello-style workflow looks like:

```text
                   BOARD
                     │
        ┌────────────┼────────────┐
        │            │            │
      TODO       IN PROGRESS     DONE
        │            │            │
     ┌──┴──┐       ┌─┴──┐       ┌─┴──┐
     │Task │       │Task │       │Task│
     │Task │       │Task │       │    │
     └─────┘       └─────┘       └────┘
```

The frontend can move a task between lists by updating:

```json
{
  "list": "NEW_LIST_ID",
  "position": 2,
  "status": "in_progress"
}
```

---

# 🔑 Authorization

Protected routes require a JWT:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Board access is granted when the authenticated user is either:

* The board owner
* A board member

Board owners additionally have permission to:

* Update the board
* Delete the board
* Add members
* Remove members

---

# 📦 Postman Collection

A Postman collection is included:

```text
Task-Management-API.postman_collection.json
```

Import it into Postman to quickly test the API.

The collection includes requests for:

* Health check
* Registration
* Login
* Boards
* Lists
* Tasks

---

# 🧩 Recommended Frontend

This API can be paired with a React frontend to create a complete MERN application.

Recommended frontend stack:

![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=flat-square\&logo=react\&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-7.x-CA4245?style=flat-square\&logo=reactrouter\&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?style=flat-square\&logo=axios\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Utility_First-06B6D4?style=flat-square\&logo=tailwindcss\&logoColor=white)

Suggested frontend pages:

```text
/login
/register
/dashboard
/boards/:boardId
```

A board page could contain:

```text
┌─────────────────────────────────────────────────────────┐
│                    My Project Board                     │
├──────────────┬──────────────┬───────────────────────────┤
│     TODO     │ IN PROGRESS  │            DONE           │
├──────────────┤──────────────┤───────────────────────────┤
│              │              │                           │
│  Task 1      │  Task 3      │  Task 5                   │
│              │              │                           │
│  Task 2      │  Task 4      │  Task 6                   │
│              │              │                           │
│     + Add    │     + Add    │        + Add              │
│              │              │                           │
└──────────────┴──────────────┴───────────────────────────┘
```

For drag-and-drop functionality, libraries such as `dnd-kit` can be used.

---

# 🚀 Future Improvements

The current API provides a strong foundation, but the following features can be added:

- Refresh token authentication
- Password reset
- Email verification
- Task comments
- File attachments
- Activity/audit logs
- Notifications
- Real-time updates with Socket.IO
- Task checklists/subtasks
- Task watchers
- Pagination
- Advanced search
- Rate limiting
- Helmet security headers
- Request validation with Zod/Joi
- Swagger/OpenAPI documentation
- Automated tests with Jest & Supertest
- Docker support
- CI/CD pipeline

---

# 🏗️ Architecture

```text
                     React Frontend
                           │
                           │ HTTP / REST
                           ▼
                  ┌─────────────────┐
                  │  Express Server │
                  └────────┬────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
           Routes      Middleware     Utils
              │            │
              └──────┬─────┘
                     ▼
                Mongoose ODM
                     │
                     ▼
              ┌──────────────┐
              │    MongoDB   │
              └──────────────┘
```

---

# 🔒 Security

The API implements several security practices:

* Passwords are never stored as plain text
* Passwords are hashed using bcrypt
* JWT authentication protects private endpoints
* Board-level authorization prevents unauthorized access
* Users can only assign board members to tasks
* Environment variables are used for secrets and database configuration

For production deployment, additional security measures such as rate limiting, Helmet, request validation, and refresh tokens are recommended.

---

# 📌 Environment Variables

| Variable         | Description               | Example                                     |
| ---------------- | ------------------------- | ------------------------------------------- |
| `PORT`           | Server port               | `5000`                                      |
| `MONGO_URI`      | MongoDB connection string | `mongodb://127.0.0.1:27017/task_management` |
| `JWT_SECRET`     | JWT signing secret        | `your_secret`                               |
| `JWT_EXPIRES_IN` | Token expiration          | `7d`                                        |
| `CLIENT_URL`     | Frontend URL              | `http://localhost:5173`                     |

---

# 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Ajinkya Dhatrak**

GitHub: [ajinkya029](https://github.com/ajinkya029)

---

⭐ If you find this project useful, consider giving it a star!
