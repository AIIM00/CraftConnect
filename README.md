# CraftConnect

CraftConnect is a full-stack service marketplace platform that connects customers with skilled craftsmen. Customers can browse services, post tasks, track bookings, and leave reviews. Craftsmen can submit applications, manage assigned tasks, control availability, complete work, and view reviews. Admins can monitor the platform, manage users, review craftsman applications, moderate reviews, issue warnings, and control task assignments.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [Main API Routes](#main-api-routes)
- [Database Models](#database-models)
- [Future Improvements](#future-improvements)
- [Screenshots] (#screenshots)
- [Author](#author)

---

## Project Overview

CraftConnect was built as a full-stack web application for managing service bookings between customers and craftsmen. The platform includes role-based dashboards, JWT cookie authentication, email OTP verification, automatic task assignment, notifications, reviews, warnings, and admin moderation.

The system is designed around three main users:

1. **Customer** — books services and tracks tasks.
2. **Craftsman** — receives tasks, accepts/rejects work, and manages availability.
3. **Admin/Super Admin** — manages users, applications, tasks, reviews, warnings, and platform activity.

---

## Key Features

### Authentication and Security

- User registration and login
- JWT authentication stored in cookies
- Role-based route protection
- Customer, craftsman, admin, and super admin roles
- Email verification using OTP
- Password reset using OTP
- Password hashing with bcrypt
- Auth middleware for protected backend routes
- Rate limiting for sensitive authentication and OTP routes
- Logout and authentication status check

### Customer Features

- Browse service categories and services
- Book/post a task
- Add task title, description, address, and location
- Select service category and service type
- Track booking status
- View booking details
- Cancel booking
- Leave a detailed review after task completion
- Manage profile and address information
- Receive notifications

### Craftsman Features

- Submit craftsman application
- Save application steps before submission
- Select category and service specialty
- Add experience, working days, working hours, and travel distance
- View application status
- Pending approval and suspended account pages
- Craftsman dashboard
- View assigned tasks
- Accept or reject task assignments
- Complete accepted tasks
- Request task withdrawal/reassignment
- View calendar/schedule
- Toggle availability status
- View customer reviews
- Receive task and application notifications

### Admin Features

- Admin dashboard with platform statistics
- View customers
- View customer profiles
- Soft delete customers
- View craftsmen
- View craftsman profiles
- Approve or reject craftsman applications
- Add custom category/service from applications
- Suspend and restore craftsmen
- View platform reviews
- View all tasks
- View unassignable tasks
- Retry task assignment
- Manually assign tasks to craftsmen
- Assign replacement craftsman for reassignment requests
- Cancel tasks
- Send warnings to craftsmen
- Remove warnings
- View flagged craftsmen
- Super admin can invite/add admins

### Task Assignment System

- Automatic craftsman assignment
- Assignment based on task category and service
- Only approved craftsmen can receive tasks
- Only available craftsmen can receive tasks
- Queue-based round-robin assignment using `queueOrder`
- Stores last assigned craftsman per category/service queue
- Prevents assigning the same task repeatedly to the same craftsman
- Tracks assignment status: `PENDING`, `ACCEPTED`, `DECLINED`, `TIMEOUT`, `TRANSFERRED`
- Supports task reassignment and admin replacement assignment

### Timeout and Worker System

- Background worker using `node-cron`
- Automatically checks pending task assignments
- Marks expired assignments as `TIMEOUT`
- Reassigns task to the next available craftsman
- Marks tasks as unassignable when no suitable craftsman is available

### Notification System

- Create notifications for task updates, warnings, applications, and reassignment events
- Get user notifications
- Get unread notification count
- Mark one notification as read
- Mark all notifications as read
- Notification dropdown/widget on the frontend

### Review and Moderation

- Customer reviews after completed tasks
- Detailed rating categories
- Average review calculation
- Admin review monitoring
- Warning system for craftsmen
- Craftsman warning levels: `NONE`, `LOW`, `MEDIUM`, `HIGH`
- Suspended craftsman handling

---

## User Roles

| Role         | Description                                                                            |
| ------------ | -------------------------------------------------------------------------------------- |
| `CUSTOMER`   | Can browse services, book tasks, track bookings, and leave reviews.                    |
| `CRAFTSMAN`  | Can apply, receive tasks, accept/reject tasks, complete work, and manage availability. |
| `ADMIN`      | Can manage customers, craftsmen, applications, reviews, warnings, and tasks.           |
| `SUPERADMIN` | Has admin permissions and can invite/add new admins.                                   |

---

## Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Tailwind CSS
- Material UI / MUI Icons
- Axios
- React Toastify
- React Leaflet / Leaflet
- date-fns

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- Cookie Parser
- bcryptjs
- Nodemailer
- Node Cron
- Express Rate Limit
- dotenv
- CORS

### Development Tools

- Git and GitHub
- npm
- Postman
- Prisma Studio
- VS Code
- ESLint
- Nodemon

---

## Project Structure

```txt
CraftConnect/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── craftsman/
│   │   │   └── customer/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   ├── services/
│   ├── src/
│   │   ├── index.js
│   │   ├── prisma.js
│   │   └── worker.js
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL database
- Git

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

---

## Environment Variables

> Important: Do not push `.env` files to GitHub. Add `.env` to `.gitignore` and create `.env.example` files instead.

### Client `.env`

Create a `.env` file inside the `client` folder:

```env
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:5000
```

### Server `.env`

Create a `.env` file inside the `server` folder:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
JWT_SECRET="your_jwt_secret"
SMTP_USER="your_email@example.com"
SMTP_PASSWORD="your_email_app_password"
SENDER_EMAIL="your_email@example.com"
```

---

## Database Setup

From the `server` folder, run:

```bash
npx prisma generate
npx prisma migrate dev
```

To seed initial data:

```bash
npm run prisma:seed
```

To open Prisma Studio:

```bash
npx prisma studio
```

---

## Running the Project

### Start the backend server

From the `server` folder:

```bash
npm run dev
```

The backend will run on:

```txt
http://localhost:5000
```

### Start the background worker

Open another terminal inside the `server` folder:

```bash
npm run dev:worker
```

The worker handles task timeout processing and automatic reassignment.

### Start the frontend

From the `client` folder:

```bash
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

---

## Available Scripts

### Client Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Starts the Vite development server. |
| `npm run build`   | Builds the frontend for production. |
| `npm run preview` | Previews the production build.      |
| `npm run lint`    | Runs ESLint checks.                 |

### Server Scripts

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Starts the Express server using Nodemon.      |
| `npm run start`        | Starts the Express server using Node.         |
| `npm run dev:worker`   | Starts the task timeout worker using Nodemon. |
| `npm run start:worker` | Starts the task timeout worker using Node.    |
| `npm run prisma:seed`  | Runs the Prisma seed file.                    |

---

## Main API Routes

### Auth Routes

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| `POST` | `/api/auth/register`         | Register a new user.           |
| `POST` | `/api/auth/login`            | Login user.                    |
| `POST` | `/api/auth/logout`           | Logout user.                   |
| `POST` | `/api/auth/send-verify-otp`  | Send account verification OTP. |
| `POST` | `/api/auth/verify-account`   | Verify user account.           |
| `GET`  | `/api/auth/is-auth`          | Check authentication status.   |
| `POST` | `/api/auth/send-reset-otp`   | Send password reset OTP.       |
| `POST` | `/api/auth/verify-reset-otp` | Verify password reset OTP.     |
| `POST` | `/api/auth/reset-password`   | Reset password.                |

### Customer/User Routes

| Method  | Endpoint                   | Description                |
| ------- | -------------------------- | -------------------------- |
| `GET`   | `/api/user/services`       | Browse available services. |
| `POST`  | `/api/user/book`           | Book/post a task.          |
| `GET`   | `/api/user/bookings`       | Get customer bookings.     |
| `GET`   | `/api/user/track/:taskId`  | Track a task.              |
| `PATCH` | `/api/user/cancel/:taskId` | Cancel a booking.          |
| `POST`  | `/api/user/review/:taskId` | Leave a review.            |
| `GET`   | `/api/user/data`           | Get user profile data.     |
| `PUT`   | `/api/user/profile`        | Update user profile.       |

### Craftsman Routes

| Method  | Endpoint                                | Description                        |
| ------- | --------------------------------------- | ---------------------------------- |
| `GET`   | `/api/craftsman/applications/me`        | Get current craftsman application. |
| `POST`  | `/api/craftsman/applications/save`      | Save application step.             |
| `POST`  | `/api/craftsman/applications/submit`    | Submit application.                |
| `GET`   | `/api/craftsman/dashboard`              | Get craftsman dashboard data.      |
| `GET`   | `/api/craftsman/tasks`                  | Get assigned tasks.                |
| `PATCH` | `/api/craftsman/tasks/:taskId/respond`  | Accept or reject a task.           |
| `PATCH` | `/api/craftsman/tasks/:taskId/complete` | Complete a task.                   |
| `GET`   | `/api/craftsman/calendar-tasks`         | Get calendar tasks.                |
| `PATCH` | `/api/craftsman/availability/toggle`    | Toggle availability.               |
| `GET`   | `/api/craftsman/reviews`                | Get craftsman reviews.             |

### Admin Routes

| Method   | Endpoint                                           | Description                      |
| -------- | -------------------------------------------------- | -------------------------------- |
| `GET`    | `/api/admin/info`                                  | Get admin dashboard information. |
| `GET`    | `/api/admin/customers`                             | Get all customers.               |
| `GET`    | `/api/admin/craftsmen`                             | Get all craftsmen.               |
| `GET`    | `/api/admin/craftsmen/applications`                | Get craftsman applications.      |
| `PATCH`  | `/api/admin/craftsmen/applications/:userId/status` | Approve or reject application.   |
| `GET`    | `/api/admin/reviews`                               | Get all reviews.                 |
| `GET`    | `/api/admin/tasks`                                 | Get all tasks.                   |
| `PATCH`  | `/api/admin/tasks/:taskId/retry`                   | Retry task assignment.           |
| `PATCH`  | `/api/admin/tasks/:taskId/cancel`                  | Cancel a task.                   |
| `PATCH`  | `/api/admin/tasks/:taskId/manual-assign`           | Manually assign task.            |
| `POST`   | `/api/admin/warnings/:craftsmanId`                 | Send warning to craftsman.       |
| `DELETE` | `/api/admin/warnings/:warningId`                   | Remove warning.                  |
| `POST`   | `/api/admin/add-admin`                             | Invite/add admin.                |

### Notification Routes

| Method  | Endpoint                                  | Description                     |
| ------- | ----------------------------------------- | ------------------------------- |
| `GET`   | `/api/notifications`                      | Get user notifications.         |
| `GET`   | `/api/notifications/unread-count`         | Get unread notification count.  |
| `PATCH` | `/api/notifications/:notificationId/read` | Mark notification as read.      |
| `PATCH` | `/api/notifications/mark-all-read`        | Mark all notifications as read. |

---

## Database Models

Main Prisma models used in this project:

- `User`
- `Craftsman`
- `Application`
- `AdminInvite`
- `Warning`
- `Location`
- `Category`
- `Service`
- `CategoryAssignmentQueue`
- `Task`
- `TaskAssignment`
- `TaskReassignmentRequest`
- `Review`
- `Project`
- `ProjectImage`
- `TaskCompletion`
- `TaskImage`
- `Notification`

Main enums:

- `Role`
- `TaskStatus`
- `AssignmentStatus`
- `CraftsmanStatus`
- `WarningLevel`
- `ApplicationStatus`
- `NotificationType`
- `ReassignmentStatus`

---

## Task Status Flow

```txt
PENDING → WAITING → IN_PROGRESS → COMPLETED
```

Other possible task states:

```txt
CANCELLED
UNASSIGNABLE
```

---

## Assignment Status Flow

```txt
PENDING → ACCEPTED
PENDING → DECLINED
PENDING → TIMEOUT
PENDING → TRANSFERRED
```

---

## Future Improvements

Possible future improvements for the project:

- Real-time notifications using Socket.io
- Real-time chat between customer and craftsman
- Online payment integration or payment simulation
- Google Maps integration
- Image upload to cloud storage
- Admin analytics charts
- Unit and integration testing
- Docker setup
- CI/CD using GitHub Actions
- Production deployment with frontend, backend, and PostgreSQL database

---

## Screenshots

### Home Page

![Home Page](screenshots/public/HomePage-Web.png)

### Services Page

![Services Page](screenshots/public/ServicesPage-Web.png)

### Service Selection Page

![Service Selection Page](screenshots/public/ServiceSelection.png)

### How It Works Page

![How It Works Page](screenshots/public/HowItWorksPage.png)

### Customer Booking

![Book a Task](screenshots/customer/BookATaskPage.png)

### Customer Bookings

![My Bookings](screenshots/customer/MyBookingsPage.png)

### Profile Page

![Profile Page](screenshots/customer/ProfilePage.png)

### Craftsman Dashboard

![Craftsman Dashboard](screenshots/craftsman/CraftsmanDashboard.png)

### Craftsman Tasks

![Craftsman Tasks](screenshots/craftsman/Craftsman-MyTaskPage.png)

### Craftsman Schedule

![Craftsman Schedule](screenshots/craftsman/Craftsman-SchedulePage.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin/AdminDashboardPage.png)

### Admin Applications

![Admin Applications](screenshots/admin/Admin-CraftsmenApplicationsPage.png)

### Admin Tasks

![Admin Tasks](screenshots/admin/Admin-TasksPage.png)

### Admin Craftsmen Page

![Admin Craftsmen Page](screenshots/admin/Admin-craftsmenpage.png)

### Admin Craftsman Profile Page

![Admin Craftsman Profile](screenshots/admin/Admin-CraftsmanProfilePage.png)

## Author

**Ali Ibrahim**  
Full-Stack Web Developer

---

## Repository Description

Full-stack service marketplace platform connecting customers with craftsmen using React, Node.js, Express, Prisma, PostgreSQL, JWT authentication, task assignment, notifications, reviews, and admin dashboards.
