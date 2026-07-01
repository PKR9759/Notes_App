# Notes App

A full-stack Notes application built with:

* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)
* **Password Hashing:** bcrypt

## Features

* User Registration
* User Login
* JWT Authentication
* Create Notes
* View All Notes
* Search Notes
* Filter Notes by Category
* Pin / Unpin Notes
* Edit Notes
* Delete Notes
* Protected Routes

---

# Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file according to .env.example:


Run the backend:

```bash
npm run dev
```

The backend will run on:

```
http://localhost:5000
```

---

# Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE notes_app;
```

Run the SQL schema provided in `database/schema.sql`.

---

# Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend will run on:

```
http://localhost:3000
```

---

