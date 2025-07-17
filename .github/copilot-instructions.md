<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# NorskkManage - React Native Cross-Platform App

This is a React Native application built with Expo that works on mobile devices (iOS/Android) and web browsers. The project uses TypeScript and Firebase for backend services.

## Project Structure
- Uses Expo Router for file-based routing
- TypeScript for type safety
- Firebase for authentication and data storage
- React Native Web for cross-platform compatibility
- Tab-based navigation

## Key Technologies
- **Expo**: React Native framework with file-based routing
- **TypeScript**: For type safety and better development experience
- **Firebase**: Backend as a service (Auth, Firestore)
- **React Native Web**: Enables web compatibility

## Authentication
- Firebase Authentication is configured in `contexts/AuthContext.tsx`
- Users must authenticate before accessing the main app
- Supports email/password authentication

## Data Management
- Firestore is used for data persistence
- Items can be created, read, and deleted
- Real-time updates from Firebase

## UI Components
- Custom reusable components in `components/ui/`
- Button and Input components with consistent styling
- Responsive design for mobile and desktop

## Development Guidelines
- All new components should be written in TypeScript (.tsx files)
- Use the existing UI components for consistency
- Follow the established file structure and naming conventions
- Test on both mobile and web platforms
- Use Firebase best practices for data operations
