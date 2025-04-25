# User Management System

A full-stack web application for user management built with Node.js, Express, MongoDB, and React.

## Features

- User authentication (Login/Register)
- Social login (Google, Facebook)
- Password reset functionality
- User profile management
- Address management
- Profile image upload
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
├── backend/             # Backend Node.js/Express application
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   └── uploads/        # File uploads directory
│
└── frontend/           # Frontend React application
    ├── public/         # Static files
    └── src/           # React source files
        ├── components/ # Reusable components
        ├── context/    # React context
        └── pages/      # Page components
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/baothanhng123/Final_NodeJS.git
cd Final_NodeJS
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create `.env` files:

Backend `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Team Members

1. [Member 1]
2. [Member 2]
3. [Member 3]

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Create a pull request
4. Wait for review and merge

## License

This project is licensed under the MIT License. 