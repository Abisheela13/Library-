# Library Management System (Full Stack)

A full stack Library Management System built using **React + Node.js + Express + Prisma + PostgreSQL**, deployed on **Render**.

---

##  Live Links

* Frontend: https://library-frontend-vyuh.onrender.com
* Backend: https://library-wkm4.onrender.com

---

##  Tech Stack

**Frontend:**

* React.js
* Axios
* React Router DOM
* Bootstrap
* Vite

**Backend:**

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* Prisma ORM

**Database:**

* PostgreSQL (NeonDB)

**Deployment:**

* Render (Frontend + Backend)

---

##  Features

### User Features

* Register / Login
* View Books
* Borrow Books
* Return Request
* View Borrow History

###  Admin Features

* Add Books
* Update Books
* Delete Books
* Approve Returns
* View All Users History

---

## Authentication

* JWT based login system
* Role-based access (USER / ADMIN)

---

##  Backend API Routes

* POST /register
* POST /login
* GET /books
* POST /books (Admin only)
* PUT /books/:id (Admin only)
* DELETE /books/:id (Admin only)
* POST /borrow/:id
* POST /return/:id
* POST /approve/:id (Admin only)
* GET /history
* GET /history/all (Admin only)

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
npx prisma generate
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

### Backend (.env)

```
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
```

### Frontend

```
VITE_API_URL=https://library-wkm4.onrender.com
```

---

##  Summary of Work Done

* Built full stack Library Management System
* Implemented JWT authentication
* Role-based access (Admin/User)
* Prisma ORM with PostgreSQL database
* CRUD operations for books
* Borrow / Return system with stock management
* Admin approval system
* Connected frontend + backend via Axios
* Fixed deployment issues (Vite, Prisma, Render)
* Deployed full project on Render

---

##  Project Status

✔ Fully working full stack project
✔ Deployed & live

