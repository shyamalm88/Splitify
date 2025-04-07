# Splitify Server

Backend server for the Splitify application.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables (see `.env.example`):

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/splitify
   JWT_SECRET=your_jwt_secret_key
   ```

3. Start the server:
   ```
   npm run dev
   ```

## Push Notifications Setup

To set up push notifications for Android and iOS:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Register your Android and iOS apps in the Firebase project:

   - For Android: Add the app and download `google-services.json`
   - For iOS: Add the app and download `GoogleService-Info.plist`

3. Get your Firebase Admin SDK service account:

   - Go to Project settings > Service accounts
   - Click "Generate new private key"
   - Save the file as `firebase-service-account.json` in the server root directory

4. For production, you can set the environment variable:

   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```

5. Update your client app to handle push notifications:
   - For React Native, use [react-native-firebase](https://rnfirebase.io/)
   - For Flutter, use [firebase_messaging](https://pub.dev/packages/firebase_messaging)

## Firebase Phone Authentication Setup

To set up Firebase phone authentication:

1. In your Firebase console, go to Authentication > Sign-in method
2. Enable Phone Authentication
3. Add test phone numbers if testing in development
4. In your client app, implement phone authentication:
   - For React Native: Use `@react-native-firebase/auth`
   - For Flutter: Use `firebase_auth` package
5. Send the Firebase ID token to your server after phone auth

### Client-side implementation example (React Native):

```javascript
import auth from "@react-native-firebase/auth";

// Send verification code
const sendVerificationCode = async (phoneNumber) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return { success: true, confirmation };
  } catch (error) {
    console.error("Error sending code:", error);
    return { success: false, error };
  }
};

// Verify code and get token
const verifyCode = async (confirmation, code) => {
  try {
    await confirmation.confirm(code);
    const idToken = await auth().currentUser.getIdToken();

    // Send this token to your server
    const response = await fetch("https://your-api.com/api/auth/phone-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error verifying code:", error);
    return { success: false, error };
  }
};
```

## OTP-Based Authentication

The server supports OTP-based authentication through Firebase. This allows users to authenticate using their phone number and a one-time password (OTP) sent to their device.

### API Endpoints

#### Send OTP

```
POST /api/auth/send-otp
```

Request body:

```json
{
  "phoneNumber": "+1234567890"
}
```

Response:

```json
{
  "success": true,
  "sessionInfo": "session-id-string",
  "inDevMode": true,
  "message": "OTP code sent successfully"
}
```

#### Verify OTP

```
POST /api/auth/verify-otp
```

Request body:

```json
{
  "phoneNumber": "+1234567890",
  "code": "123456",
  "sessionInfo": "session-id-string"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt-token-string",
  "user": {
    "id": "user-id",
    "username": "username",
    "phoneNumber": "+1234567890",
    "email": "user@example.com"
  },
  "firebaseToken": "firebase-custom-token",
  "inDevMode": true
}
```

### Development Mode

In development mode, the OTP code is always "123456" and is logged to the console. This allows for easy testing without actually sending SMS messages.

### Production Mode

In production mode, Firebase Authentication is used to send and verify OTP codes. This requires setting up Firebase Auth with a phone provider in your Firebase project.

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Push Notifications

- `POST /api/notifications/register-token` - Register a device token for push notifications
- `DELETE /api/notifications/remove-token` - Remove a device token
- `POST /api/notifications/send` - Send a push notification to a specific user
- `POST /api/notifications/broadcast` - Send a push notification to all users

### Phone Authentication

- `POST /api/auth/phone-login` - Login or register with Firebase phone authentication
- `POST /api/auth/link-phone` - Link phone number to an existing account

## Project Structure

```
server/
  ├── config/         # Configuration files
  ├── controllers/    # Route controllers
  ├── models/         # Database models
  ├── routes/         # API routes
  ├── .env            # Environment variables
  └── index.js        # Server entry point
```
