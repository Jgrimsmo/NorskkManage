# Developer Setup Guide

## Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

## Setup Instructions

### 1. Clone and Install Dependencies
```bash
git clone [repository-url]
cd NorskkManage
npm install
```

### 2. Firebase Configuration
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage
5. Get your Firebase config from Project Settings > General > Your apps

### 3. Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Firebase Security Rules
Deploy the Firestore security rules:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### 5. Start Development Server
```bash
npm start
```

## Project Structure
- `/app` - Expo Router file-based routing
- `/components` - Reusable React components
- `/config` - Configuration files (Firebase)
- `/contexts` - React contexts (Auth)
- `/services` - Business logic and API calls
- `/styles` - Styling and theme configuration
- `/utils` - Utility functions

## Key Technologies
- **React Native + Expo** - Cross-platform mobile/web framework
- **TypeScript** - Type safety
- **Firebase** - Backend services (Auth, Firestore, Storage)
- **Expo Router** - File-based navigation

## Security Notes
- Never commit `.env` files to version control
- Use your own Firebase project for development
- Review and customize Firestore security rules for your use case
- The provided security rules are more restrictive than the original development setup

## Development Guidelines
- Follow TypeScript best practices
- Use the existing UI components in `/components/ui/`
- Test on both mobile and web platforms
- Maintain the established file structure and naming conventions

## Troubleshooting
- If you get Firebase errors, ensure your `.env` file is properly configured
- For Expo issues, try clearing the cache: `expo start -c`
- For TypeScript errors, run: `npx tsc --noEmit`

## Additional Resources
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
