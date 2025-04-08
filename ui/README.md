# UI Expo App

A blank template Expo project with essential dependencies pre-installed for a smoother development experience.

## Features

- React Navigation setup with native stack navigator
- React Native Paper for UI components
- React Native Gesture Handler for gestures
- Bottom Sheet for interactive bottom sheets
- Reanimated for animations
- Async Storage for local data persistence
- Axios for API requests
- Zustand for state management
- Vector icons support
- TypeScript and ESLint configuration

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo Go app on your physical device or emulator/simulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Device/Simulator

- For iOS: `npm run ios`
- For Android: `npm run android`
- For Web: `npm run web`

### Project Structure

```
UI-expo/
├── src/
│   ├── screens/       # Application screens
│   ├── components/    # Reusable UI components
│   ├── navigation/    # Navigation configuration
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── assets/        # Images and other assets
├── App.js             # Main application component
└── ...
```

## Dependencies

- @react-navigation/native
- @react-navigation/native-stack
- react-native-paper
- react-native-gesture-handler
- react-native-reanimated
- @gorhom/bottom-sheet
- zustand
- axios
- @react-native-async-storage/async-storage
- expo-image-picker
- And more...
