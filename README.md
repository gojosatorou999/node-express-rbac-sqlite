# Role Based Access Control (RBAC) Implementation

This project implements a basic backend with Role-Based Access Control using **Node.js, Express, JWT, and SQLite**. Users can register as either an 'admin' or a 'user' and access routes accordingly.

#Authorization Logic :

The application uses **JWT (JSON Web Token)** for authentication and carrying role information.

1. **Authentication:** When a user logs in, the server generates a JWT containing their `id`, `username`, and `role`.
2. **Access Control:** A middleware `authorizeRoles` guards protected routes. It checks the role stored in the decoded JWT and compares it against the required roles for that route.
3. **Database Storage:** User roles are stored in the SQLite database under a `role` column in the `users` table.

---->Key Features 

- **Password Hashing:** Uses `bcryptjs` to securely hash passwords before storing them.
- **JWT Middleware:** Verifies the token provided in the `Authorization` header.
- **RBAC Middleware:** Restricts route access based on user roles.
- **SQLite DB:** A simple file-based database to store user authentication and role data.

## API Endpoints 

- **POST /auth/register:** Creates a new user with a specified role (`admin`/`user`).
- **POST /auth/login:** Authenticates and returns a JWT token.
- **GET /api/public:** Accessible to any visitor.
- **GET /api/user-dashboard:** Accessible to users with 'user' or 'admin' roles.
- **GET /api/admin-panel:** Only accessible to users with the 'admin' role.

##### Getting Started

1. **Install Dependencies:** `npm install`
2. **Run Server:** `npm run dev` (starts with nodemon) or `node server.js`
3. **Access UI:** Open `http://localhost:3000` in your browser.

## Database Schema

| Column     | Type    | Description                |
| ---------- | ------- | -------------------------- |
| id         | INTEGER | Primary Key (Autoincrement) |
| username   | TEXT    | Unique user name           |
| password   | TEXT    | Bcrypt hashed password     |
| role       | TEXT    | 'user' (default) or 'admin' |
