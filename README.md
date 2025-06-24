# Fitness Tracker API
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![bcrypt](https://img.shields.io/badge/bcrypt-004488?logo=lock&logoColor=white)](https://www.npmjs.com/package/bcrypt)

## Description
A fitness tracker API that can be used to track workouts, meals and goals.

## Features
- User registration, login, password reset
- Authentication via JWT
- Workout tracking
- Meal tracking
- Goal setting and management
- Personalized recommendations
- Admin control for user accounts

## Getting Started
**Clone the repository**

git clone https://github.com/Reiss2025/Fitness_Tracker_API.git

**Change your directory to Fitness_Tracker_API**

cd Fitness_Tracker_API
   
**Install dependencies**

npm install

**Create the database**

Use the provided Fitness_Tracker_Database.SQL file to create the required MySQL database.

**Set up environment variables**

Create a .env file in the root directory with the following:

DATABASE_HOST=your_host
DATABASE_USER=your_username
DATABASE_PASS=your_password
DATABASE_DB=your_database_name

JWT_SECRET=your_random_secret
TOKEN_EXPIRY=1h

**(Optional) Enable Admin Access**

To make a user an admin, set the admin column to 1 for their user record in the database.

**Start the Server**

npm start

## Endpoints
### Public Routes
- `POST /login/` — User login  
- `POST /register/` — User registration

### Protected Routes (Requires JWT Auth)
**User Profile**
- `GET /profile/`  
- `PATCH /profile/`  
- `DELETE /profile/`  
- `POST /reset-password/`  
- `POST /logout/`

**Workouts**
- `GET /workouts/`  
- `GET /workouts/:id`  
- `POST /workouts/`  
- `PATCH /workouts/:id`  
- `DELETE /workouts/:id`

**Meals**
- `GET /meals/`  
- `GET /meals/:id`  
- `POST /meals/`  
- `PATCH /meals/:id`  
- `DELETE /meals/:id`

**Goals**
- `GET /goals/`  
- `GET /goals/:id`  
- `POST /goals/`  
- `PATCH /goals/:id`  
- `DELETE /goals/:id`

**Recommendations**
- `GET /recommendations/`  
- `GET /recommendation/:id`  
- `DELETE /recommendation/:id`

### Admin Routes (JWT + Admin Role Required)
- `GET /admin/profiles/`  
- `GET /admin/profile/:id`  
- `POST /admin/reset-password/:id`  
- `DELETE /admin/profile/:id`

## Creator
Created by Reiss2025

