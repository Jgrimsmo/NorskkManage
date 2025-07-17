# NorskkManage - Construction Management App

A comprehensive React Native construction management application built with Expo that runs seamlessly on mobile devices (iOS/Android) and web browsers. Features complete project management, time tracking, crew management, equipment tracking, and safety reporting with Firebase backend.

## ✨ Features

### Core Management
- **Project Management**: Create, track, and manage construction projects with cost codes
- **Time Tracking**: Advanced timecard system with approval workflows
- **Crew Management**: Employee profiles, roles, and contact management
- **Equipment Tracking**: Inventory management and usage logging
- **Safety Reports**: Daily safety reports and FLHA (Field Level Hazard Assessment) forms

### Technical Features
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Authentication**: Firebase email/password authentication with role-based access
- **Real-time Data**: Live updates using Firestore real-time listeners
- **TypeScript**: Full type safety and better development experience
- **Modern UI**: Clean, responsive design optimized for construction workflows
- **File-based Routing**: Intuitive navigation using Expo Router

## 🎯 Application Modules

### 📊 Management
- **Projects**: Project creation, scope management, progress tracking
- **Timecards**: Time entry, approval workflow, export functionality
- **Crew**: Employee management, role assignment, contact information
- **Equipment**: Equipment inventory, usage tracking, maintenance scheduling
- **Dispatch**: Job assignments and resource allocation

### 💰 Estimating
- **Project Database**: Searchable project templates and historical data
- **Bidding**: Cost estimation and proposal generation

### 🛡️ Safety
- **Daily Reports**: Safety incident reporting with photo attachments
- **FLHA Forms**: Field Level Hazard Assessment documentation

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`

### Installation

1. Clone and navigate to the project:
   ```bash
   cd NorskkManage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config and update `config/firebase.ts`

### Running the App

```bash
# Start development server
npm start

# Run on web
npm run web

# Run on Android (requires Android Studio/emulator)
npm run android

# Run on iOS (requires Xcode/macOS)
npm run ios
```

## 📱 Platforms Supported

- **Web**: Runs in any modern web browser
- **iOS**: iPhone and iPad (requires macOS for development)
- **Android**: All Android devices

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Routing**: Expo Router (file-based)
- **Backend**: Firebase (Auth + Firestore)
- **UI**: Custom components with React Native styling
- **Development**: Hot reloading, fast refresh

## 📂 Project Structure

```
├── app/                    # File-based routing
│   ├── (tabs)/            # Tab navigation
│   ├── management/        # Project, crew, equipment, timecard management
│   │   ├── projects.tsx   # Project management
│   │   ├── timecards.tsx  # Time tracking system
│   │   ├── crew.tsx       # Crew management
│   │   └── equipment.tsx  # Equipment tracking
│   ├── estimating/        # Cost estimation and bidding
│   ├── safety/           # Safety reports and FLHA forms
│   └── _layout.tsx       # Root layout with authentication
├── components/
│   ├── ui/               # Base UI components (Button, Input, DatePicker)
│   ├── timecard/         # Time tracking specific components
│   ├── modals/           # Modal dialogs for various features
│   └── AuthScreen.tsx    # Authentication component
├── contexts/
│   └── AuthContext.tsx   # Authentication context with Firebase
├── config/
│   └── firebase.ts       # Firebase configuration
├── services/             # Business logic and API services
├── styles/              # Modular styling system
├── utils/               # Utility functions
└── assets/              # Static assets
```

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run web` - Run on web browser
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
4. Enable Firestore:
   - Go to Firestore Database > Create database
   - Start in test mode
5. Get your config:
   - Go to Project Settings > General
   - Add a web app and copy the config
   - Update `config/firebase.ts` with your values

## 🎯 Features Overview

### Construction Management
- **Project Lifecycle**: Full project management from estimation to completion
- **Time Tracking**: Advanced timecard system with pay period calculations
- **Resource Management**: Crew scheduling and equipment allocation
- **Cost Control**: Real-time cost tracking and budget management
- **Safety Compliance**: Comprehensive safety reporting and hazard assessments

### Technical Capabilities
- **Real-time Synchronization**: Live data updates across all connected devices
- **Cross-platform Access**: Native mobile apps and web dashboard
- **Role-based Security**: Manager and worker access levels
- **Export Functionality**: CSV/Excel exports for payroll and reporting
- **Photo Documentation**: Image attachments for reports and inspections

## 🔐 Security

- Firebase security rules should be configured for production
- User authentication required for all data operations
- Client-side validation with server-side security

## 📈 Recent Improvements

### ✅ Code Quality Enhancements
- **Unified Style System**: Consolidated styling architecture for better maintainability
- **Delete Functionality**: Verified and cleaned up delete operations across all modules
- **Firebase Integration**: Confirmed proper authentication and security rules
- **TypeScript Coverage**: Enhanced type safety throughout the application
- **Performance Optimization**: Improved real-time data loading and rendering

### ✅ Resolved Issues
- Fixed timecard deletion functionality with proper user authentication
- Cleaned up redundant style files and unified imports
- Removed debug code and console logs from production code
- Verified cross-platform compatibility for web and mobile

## 📈 Future Roadmap

- [ ] Advanced reporting dashboard with charts and analytics
- [ ] Mobile push notifications for important updates
- [ ] Offline mode with data synchronization
- [ ] Integration with accounting software (QuickBooks, etc.)
- [ ] GPS tracking for equipment and crew location
- [ ] Document management system for contracts and permits
- [ ] Customer portal for project updates and communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple platforms
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React Native, Expo, and Firebase
