# 🏪 RateMe - Store Rating Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)
![MySQL](https://img.shields.io/badge/mysql-8.0+-orange.svg)

A modern, full-stack web application for rating and reviewing stores with role-based access control, built with React, Node.js, Express, and MySQL.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔧 Configuration](#-configuration)
- [🗄️ Database Setup](#️-database-setup)
- [🚀 Running the Application](#-running-the-application)
- [📡 API Documentation](#-api-documentation)
- [👥 User Roles & Permissions](#-user-roles--permissions)
- [🎨 UI/UX Features](#-uiux-features)
- [🔐 Security](#-security)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)

## 🎯 Project Overview

RateMe is a comprehensive store rating platform that enables users to discover, rate, and review local businesses. The platform features a modern dark theme UI, role-based access control, and real-time analytics for store owners and administrators.

### 🎯 Key Objectives
- **User Experience**: Provide an intuitive platform for discovering and rating stores
- **Business Intelligence**: Offer analytics and insights for store owners
- **Community Building**: Foster a trusted review ecosystem
- **Scalability**: Built with modern technologies for future growth

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based secure authentication
- Role-based access control (Admin, Store Owner, User)
- Secure password hashing with bcrypt
- Protected routes and middleware

### 🏪 **Store Management**
- Store registration and profile management
- Category-based store classification
- Image upload and management
- Store analytics and performance metrics

### ⭐ **Rating & Review System**
- 5-star rating system
- Detailed text reviews
- Rating analytics and aggregation
- Review moderation capabilities

### 👤 **User Management**
- User registration and profile management
- Personal review history
- Favorite stores functionality
- User activity tracking

### 🎨 **Modern UI/UX**
- **Dark Theme**: Consistent dark mode across all pages
- **Responsive Design**: Mobile-first approach
- **Interactive Components**: Modern UI with Radix UI components
- **Smooth Animations**: Enhanced user experience with transitions

### 📊 **Analytics & Reporting**
- Store performance dashboards
- Rating trends and insights
- User engagement metrics
- Administrative reporting tools

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│   (Node.js)     │◄──►│    (MySQL)      │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Express.js    │    │ • MySQL 8.0+    │
│ • Vite          │    │ • Sequelize ORM │    │ • Sequelize     │
│ • TailwindCSS   │    │ • JWT Auth      │    │ • ACID Compliant│
│ • Radix UI      │    │ • Validation    │    │ • Relationships │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### **Frontend**
- **React 19.1.1** - Modern UI library with latest features
- **Vite 7.1.2** - Fast build tool and development server
- **TailwindCSS 4.1.12** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router DOM 7.8.0** - Client-side routing
- **Axios 1.11.0** - HTTP client for API requests
- **Lucide React** - Modern icon library
- **React Hook Form** - Form validation and management

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **Sequelize 6.37.7** - Promise-based ORM for MySQL
- **MySQL2 3.14.3** - MySQL database driver
- **JWT** - JSON Web Token authentication
- **bcrypt 6.0.0** - Password hashing
- **express-validator 7.2.1** - Input validation middleware

### **Database**
- **MySQL 8.0+** - Relational database management system
- **Sequelize ORM** - Object-relational mapping
- **ACID Compliance** - Data integrity and consistency
- **Foreign Key Constraints** - Referential integrity

### **Development Tools**
- **Nodemon** - Development server auto-restart
- **ESLint** - Code linting and formatting
- **dotenv** - Environment variable management

## 📁 Project Structure

```
MERN-Project/
├── Frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── Auth/           # Authentication components
│   │   ├── assets/         # Images, icons, styles
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StoreOwnerDashboard.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── Backend/                 # Node.js backend application
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   │   └── database.js # Sequelize configuration
│   │   ├── models/         # Database models
│   │   │   ├── User.js     # User model with roles
│   │   │   ├── Store.js    # Store model with categories
│   │   │   └── Rating.js   # Rating and review model
│   │   ├── routes/         # API route handlers
│   │   │   ├── auth.routes.js    # Authentication routes
│   │   │   ├── stores.routes.js  # Store management routes
│   │   │   ├── rating.route.js   # Rating system routes
│   │   │   └── user.route.js     # User management routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── db.js          # MySQL connection pool
│   │   └── server.js      # Express server setup
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
└── README.md             # Project documentation
```

## ⚙️ Installation & Setup

### **Prerequisites**
- **Node.js** (v16.0.0 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

### **1. Clone the Repository**
```bash
git clone https://github.com/SuchitHubale/RateMe.git
cd RateMe
```

### **2. Backend Setup**
```bash
cd Backend
npm install


### **3. Frontend Setup**
```bash
cd Frontend
npm install
```

### **4. Database Setup**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE store_rating_app;
```

## 🔧 Configuration

### **Backend Environment Variables (.env)**
```env
PORT=4000
DB_HOST=localhost
DB_PORT=your_database_port
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret

```

### **Frontend Environment Variables (.env)**
```env
# API Configuration
VITE_API_URL=http://localhost:4000/api
```

## 🗄️ Database Setup

The application uses **MySQL** with **Sequelize ORM** for database management.

### **Database Models**

#### **Users Table**
```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('ADMIN', 'USER', 'OWNER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Stores Table**
```sql
CREATE TABLE stores (
  store_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400) NOT NULL,
  category ENUM('Electronics', 'Clothing', 'Books', 'Grocery', 'Cafe', 'Sports', 'Other'),
  phone VARCHAR(20),
  description TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  reviewCount INT DEFAULT 0,
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

#### **Ratings Table**
```sql
CREATE TABLE ratings (
  rating_id INT PRIMARY KEY AUTO_INCREMENT,
  rating_value TINYINT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
  comment TEXT,
  user_id INT,
  store_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE
);
```

### **Sequelize Auto-Migration**
The application automatically creates tables using Sequelize models. No manual SQL execution required.

## 🚀 Running the Application

### **Development Mode**

#### **Start Backend Server**
```bash
cd Backend
npm run dev
# Server runs on http://localhost:4000
```

#### **Start Frontend Development Server**
```bash
cd Frontend
npm run dev
# Application runs on http://localhost:5173
```

### **Production Build**
```bash
# Build frontend for production
cd Frontend
npm run build

# Start backend in production mode
cd Backend
npm start
```

## 📡 API Documentation

### **Authentication Endpoints**

#### **POST /api/auth/register**
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "USER",
  "address": "123 Main St"
}
```

#### **POST /api/auth/login**
User login
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### **Store Management Endpoints**

#### **GET /api/stores**
Get all stores with pagination and filtering
```bash
GET /api/stores?category=Electronics&page=1&limit=10
```

#### **POST /api/stores**
Create a new store (Owner/Admin only)
```json
{
  "name": "Tech Store",
  "email": "contact@techstore.com",
  "address": "456 Tech Ave",
  "category": "Electronics",
  "phone": "+1234567890",
  "description": "Best electronics store in town"
}
```

#### **PUT /api/stores/:id**
Update store information (Owner/Admin only)

#### **DELETE /api/stores/:id**
Delete a store (Admin only)

### **Rating System Endpoints**

#### **POST /api/ratings**
Submit a rating/review
```json
{
  "store_id": 1,
  "rating_value": 5,
  "comment": "Excellent service and products!"
}
```

#### **GET /api/ratings/store/:storeId**
Get all ratings for a specific store

#### **PUT /api/ratings/:id**
Update user's own rating

#### **DELETE /api/ratings/:id**
Delete rating (User's own or Admin)

### **User Management Endpoints**

#### **GET /api/users/profile**
Get current user profile

#### **PUT /api/users/profile**
Update user profile

#### **GET /api/users/:id/ratings**
Get user's rating history

## 👥 User Roles & Permissions

| Feature | Admin | Store Owner | User |
|---------|-------|-------------|------|
| **Authentication** |
| Register/Login | ✅ | ✅ | ✅ |
| **Store Management** |
| View All Stores | ✅ | ✅ | ✅ |
| Create Store | ✅ | ✅ | ❌ |
| Edit Own Store | ✅ | ✅ | ❌ |
| Edit Any Store | ✅ | ❌ | ❌ |
| Delete Store | ✅ | ❌ | ❌ |
| **Rating System** |
| View Ratings | ✅ | ✅ | ✅ |
| Submit Rating | ✅ | ❌ | ✅ |
| Edit Own Rating | ✅ | ❌ | ✅ |
| Delete Any Rating | ✅ | ❌ | ❌ |
| **User Management** |
| View All Users | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| **Analytics** |
| System Analytics | ✅ | ❌ | ❌ |
| Store Analytics | ✅ | ✅ | ❌ |

## 🎨 UI/UX Features

### **🌙 Dark Theme Design**
- **Consistent Styling**: Dark theme applied across all dashboard pages
- **Modern Gradients**: Sophisticated gray-900 to gray-800 backgrounds
- **Accessible Colors**: High contrast text for optimal readability
- **Interactive Elements**: Hover states and transitions for better UX

### **📱 Responsive Design**
- **Mobile-First**: Optimized for all device sizes
- **Flexible Layouts**: Grid and flexbox layouts adapt to screen sizes
- **Touch-Friendly**: Appropriate button sizes and spacing

### **🎯 User Experience**
- **Intuitive Navigation**: Clear menu structure and breadcrumbs
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages and recovery options
- **Form Validation**: Real-time validation with helpful feedback

### **🎨 Component Library**
- **Radix UI**: Accessible, unstyled component primitives
- **Lucide Icons**: Modern, consistent iconography
- **TailwindCSS**: Utility-first styling for rapid development

## 🔐 Security

### **🔒 Authentication & Authorization**
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Role-Based Access**: Granular permissions based on user roles
- **Protected Routes**: Frontend and backend route protection

### **🛡️ Data Protection**
- **Input Validation**: Server-side validation with express-validator
- **SQL Injection Prevention**: Sequelize ORM parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Controlled cross-origin resource sharing

### **🔐 Best Practices**
- **Environment Variables**: Sensitive data stored securely
- **HTTPS Ready**: SSL/TLS encryption support
- **Rate Limiting**: API endpoint protection against abuse
- **Security Headers**: Helmet.js for security headers

## 🚀 Deployment

### **🌐 Frontend Deployment (Vercel/Netlify)**

#### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
cd Frontend
npm run build
vercel --prod
```

#### **Netlify Deployment**
```bash
# Build for production
cd Frontend
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### **🖥️ Backend Deployment (Railway/Heroku)**

#### **Railway Deployment**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

#### **Heroku Deployment**
```bash
# Create Heroku app
heroku create rateme-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=your_mysql_host
heroku config:set DB_NAME=your_db_name
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

### **🗄️ Database Deployment**

#### **MySQL Cloud Options**
- **PlanetScale**: Serverless MySQL platform
- **AWS RDS**: Managed MySQL service
- **Google Cloud SQL**: Fully managed MySQL
- **DigitalOcean Managed Databases**: Simple MySQL hosting

## 🤝 Contributing

### **📋 Development Workflow**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **📋 Code Standards**

- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **Conventional Commits**: Follow commit message conventions
- **Testing**: Include tests for new features

### **🐛 Bug Reports**

Please use the [issue tracker](https://github.com/yourusername/rateme-platform/issues) to report bugs.

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/rateme-platform/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/rateme-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/rateme-platform/discussions)

---

<div align="center">

**Built with ❤️ by [Your Name]**

[⭐ Star this repo](https://github.com/yourusername/rateme-platform) • [🐛 Report Bug](https://github.com/yourusername/rateme-platform/issues) • [✨ Request Feature](https://github.com/yourusername/rateme-platform/issues)

</div>
