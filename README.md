# GitBase

A full-stack GitHub-inspired platform built with React and Node.js. Create repositories, track issues, manage your profile — all with a clean dark-themed UI.

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)

---

## Features

- **Authentication** — Sign up, log in with JWT-based auth and bcrypt password hashing
- **Dashboard** — View your repositories, explore public repos, recent activity feed
- **Repositories** — Create, view, delete repos with public/private visibility toggle
- **Issues** — Open, close, and delete issues on any repository with open/closed filtering
- **Profile** — Contribution heatmap, pinned repositories, follower stats
- **Settings** — Update email, change password, delete account
- **Git Operations** — CLI-based init, add, commit, push (S3), pull, and revert via yargs
- **Real-time** — Socket.io integration for live updates

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, React Router, Primer React, Vite |
| Backend | Express 5, Node.js, yargs CLI |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Storage | AWS S3 (for push/pull) |
| Real-time | Socket.io |

## Project Structure

```
GitBase/
├── backend/
│   ├── config/
│   │   └── aws-config.js          # S3 configuration
│   ├── controllers/
│   │   ├── userController.js      # Signup, login, profile CRUD
│   │   ├── repoController.js      # Repository CRUD + visibility toggle
│   │   ├── issueController.js     # Issue CRUD + status toggle
│   │   ├── init.js                # git init equivalent
│   │   ├── add.js                 # git add equivalent
│   │   ├── commit.js              # git commit equivalent
│   │   ├── push.js                # Push commits to S3
│   │   ├── pull.js                # Pull commits from S3
│   │   └── revert.js              # Revert to a specific commit
│   ├── models/
│   │   ├── userModel.js           # User schema
│   │   ├── repoModel.js           # Repository schema
│   │   └── issueModel.js          # Issue schema
│   ├── routes/
│   │   ├── main.router.js         # Combines all routers
│   │   ├── user.router.js         # Auth & user routes
│   │   ├── repo.router.js         # Repository routes
│   │   └── issue.router.js        # Issue routes
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── authorizeMiddleware.js
│   ├── seed.js                    # Database seeder script
│   ├── index.js                   # Entry point (server + CLI)
│   └── .env                       # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   └── auth.css
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── dashboard.css
│   │   │   ├── repo/
│   │   │   │   ├── CreateRepo.jsx
│   │   │   │   ├── RepoDetail.jsx
│   │   │   │   └── repo.css
│   │   │   ├── issue/
│   │   │   │   ├── CreateIssue.jsx
│   │   │   │   └── IssueDetail.jsx
│   │   │   ├── user/
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── HeatMap.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── profile.css
│   │   │   ├── Navbar.jsx
│   │   │   └── navbar.css
│   │   ├── assets/
│   │   ├── authContext.jsx        # Auth context provider
│   │   ├── Routes.jsx             # All route definitions
│   │   ├── index.css              # Global styles
│   │   └── main.jsx               # App entry point
│   └── package.json
│
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- AWS account with S3 bucket (optional, for push/pull)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/GitBase.git
cd GitBase
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET_KEY=your_secret_key
```

### 3. Seed the database (optional)

```bash
node seed.js
```

This inserts 3 users, 10 repositories, and 10 issues with realistic data.

**Test accounts:**

| Email | Password |
|-------|----------|
| siddhant@gmail.com | password123 |
| arjun@gmail.com | password123 |
| priya@gmail.com | password123 |

### 4. Start the backend

```bash
node index.js start
```

The server runs on `http://localhost:3000`.

### 5. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login and get JWT token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/allUsers` | List all users |
| GET | `/userProfile/:id` | Get user profile |
| PUT | `/updateProfile/:id` | Update email/password |
| DELETE | `/deleteProfile/:id` | Delete account |

### Repositories
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/repo/create` | Create a repository |
| GET | `/repo/all` | List all repositories |
| GET | `/repo/:id` | Get repository by ID |
| GET | `/repo/name/:name` | Get repository by name |
| GET | `/repo/user/:userID` | Get user's repositories |
| PUT | `/repo/update/:id` | Update repository |
| PATCH | `/repo/toggle/:id` | Toggle visibility |
| DELETE | `/repo/delete/:id` | Delete repository |

### Issues
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/issue/create/:id` | Create issue on a repo |
| GET | `/issue/all/:id` | List issues for a repo |
| GET | `/issue/:id` | Get issue by ID |
| PUT | `/issue/update/:id` | Update issue |
| DELETE | `/issue/delete/:id` | Delete issue |

## CLI Commands

GitBase also works as a CLI tool for local git-like operations:

```bash
node index.js init                    # Initialize a .gitBase repository
node index.js add <file>              # Stage a file
node index.js commit "message"        # Commit staged files
node index.js push                    # Push commits to S3
node index.js pull                    # Pull commits from S3
node index.js revert <commitID>       # Revert to a specific commit
```

## License

ISC
