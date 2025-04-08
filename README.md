# Splitify - Expense Sharing App

Splitify is a modern expense-sharing application that helps friends, roommates, and groups easily split and track expenses.

## Features

- User authentication with email, phone, and social logins
- Create and manage expense groups
- Add and categorize expenses
- Split expenses equally or custom amounts
- Track balances between users
- Settle up with integrated payment options
- Real-time notifications

## Project Structure

The application is divided into two main parts:

- **Server**: Node.js/Express backend with MongoDB
- **UI**: React Native mobile app

## Optimizations & Best Practices

### Server-side

- **Service Layer Architecture**: Separation of concerns with controllers, services, and models
- **Caching**: In-memory caching with node-cache for frequently accessed data
- **Error Handling**: Centralized error handling with custom error classes
- **Data Validation**: Request validation using Joi with custom validators
- **Database Optimization**:
  - Indexed fields for faster queries
  - Compound indexes for common query patterns
  - Static helper methods on models
- **Security**:
  - Helmet for secure HTTP headers
  - JWT-based authentication
  - Input validation and sanitization

### Client-side

- **State Management**: Efficient state management with Context API
- **Performance**:
  - Component memoization
  - Optimized re-renders
  - Image optimization
- **Code Organization**: Clear separation of concerns with directories for components, screens, etc.
- **Navigation**: React Navigation with deep linking support
- **Offline Support**: Local storage for offline data access

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- React Native development environment

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/splitify.git
cd splitify
```

2. Install server dependencies:

```bash
cd server
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:

```bash
npm start
```

5. Install UI dependencies:

```bash
cd ../ui
npm install
```

6. Configure UI environment:

```bash
cp .env.example .env
# Edit .env with your configuration
```

7. Start the UI:

```bash
npm start
```

## Development

The project follows a modular architecture with clear separation of concerns.

### Server Architecture

- **controllers/**: Handle HTTP requests and responses
- **models/**: MongoDB schemas and models
- **services/**: Business logic layer
- **routes/**: API route definitions
- **middleware/**: Express middleware functions
- **utils/**: Utility functions and helpers
- **config/**: Configuration files

### UI Architecture

- **components/**: Reusable UI components
- **screens/**: Screen components
- **navigation/**: Navigation configuration
- **context/**: React context providers
- **services/**: API service wrappers
- **hooks/**: Custom React hooks
- **utils/**: Utility functions
- **theme/**: Styling and theming

## License

This project is licensed under the MIT License
