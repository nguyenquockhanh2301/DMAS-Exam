# Battle Game - React Frontend

This is the React frontend application for the Battle Game assignment.

## Features

- Display player assets in a table format
- Real-time data fetching from Azure Functions API
- Responsive design
- Error handling and loading states
- Refresh functionality

## Prerequisites

- Node.js (v18 or higher)
- Azure Functions backend running (see `../azure-functions/README.md`)

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Configuration

The API base URL is configured in `src/App.js`:

```javascript
const API_BASE_URL = 'http://localhost:7071/api';
```

If your Azure Functions is running on a different port or URL, update this variable.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## API Integration

The app connects to the following endpoint:
- **GET** `/api/getassetsbyplayer` - Fetches all player assets

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # React entry point
└── index.css       # Global styles
```

## Features Implemented

✅ Fetch and display player assets from Azure Functions API  
✅ Table display with columns: No, Player Name, Level, Age, Asset Name  
✅ Loading indicator while fetching data  
✅ Error handling with retry functionality  
✅ Refresh button to reload data  
✅ Responsive design for mobile and desktop  
✅ Modern UI with gradient background
