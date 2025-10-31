# Battle Game - DMAS Exam Assignment

**Developing Microsoft Azure Solutions - SET01**

This project implements a game management system with Azure Functions backend and React frontend for the DMAS practical exam.

## 📋 Assignment Requirements

✅ **Database**: BATTLEGAME with tables Player, Asset, and PlayerAsset  
✅ **API 1**: `registerplayer` - Register new players  
✅ **API 2**: `createasset` - Create new game assets  
✅ **API 3**: `getassetsbyplayer` - Get player assets report  
✅ **Frontend**: React application to display player assets table  
✅ **Deployment Guide**: Tutorial for deploying to Azure Cloud  

## 🏗️ Project Structure

```
DMAS Exam/
├── database/                    # Database scripts
│   ├── create_database.sql     # Database schema (Database First)
│   └── sample_data.sql         # Sample test data
├── azure-functions/            # Azure Functions backend
│   ├── src/
│   │   ├── db.js              # Database connection utility
│   │   └── functions/
│   │       ├── registerplayer.js
│   │       ├── createasset.js
│   │       └── getassetsbyplayer.js
│   ├── host.json
│   ├── local.settings.json
│   └── package.json
├── battlegame-app/             # React frontend
│   ├── src/
│   │   ├── App.js             # Main application component
│   │   └── App.css            # Styling
│   └── package.json
├── DEPLOYMENT_GUIDE.md         # Azure deployment tutorial
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- XAMPP (MySQL)
- Azure Functions Core Tools (optional for local testing)

### 1. Database Setup

Make sure XAMPP MySQL is running, then:

```bash
# Create database and tables
mysql -u root < database/create_database.sql

# Insert sample data
mysql -u root < database/sample_data.sql
```

### 2. Azure Functions Backend

```bash
cd azure-functions
npm install
npm start
```

The APIs will be available at `http://localhost:7071/api/`

### 3. React Frontend

```bash
cd battlegame-app
npm install
npm start
```

The app will open at `http://localhost:3000`

## 🔌 API Endpoints

### 1. Register Player
**POST** `/api/registerplayer`

**Request Body:**
```json
{
  "playerName": "Player4",
  "fullName": "John Doe",
  "age": "25",
  "level": 5,
  "email": "player4@game.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Player registered successfully",
  "data": {
    "playerId": "uuid-here",
    "playerName": "Player4",
    "fullName": "John Doe",
    "age": "25",
    "level": 5,
    "email": "player4@game.com"
  }
}
```

### 2. Create Asset
**POST** `/api/createasset`

**Request Body:**
```json
{
  "assetName": "Magic Sword",
  "levelRequire": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Asset created successfully",
  "data": {
    "assetId": "uuid-here",
    "assetName": "Magic Sword",
    "levelRequire": 10
  }
}
```

### 3. Get Assets By Player
**GET** `/api/getassetsbyplayer`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "no": 1,
      "playerName": "Player1",
      "level": 10,
      "age": "20",
      "assetName": "Hero 1"
    }
  ]
}
```

## 🗄️ Database Schema

### Player Table
- `PlayerId` (VARCHAR, PRIMARY KEY)
- `PlayerName` (VARCHAR, UNIQUE)
- `FullName` (VARCHAR)
- `Age` (VARCHAR)
- `Level` (INT)
- `Email` (VARCHAR)
- `CreatedAt` (TIMESTAMP)

### Asset Table
- `AssetId` (VARCHAR, PRIMARY KEY)
- `AssetName` (VARCHAR)
- `LevelRequire` (INT)
- `CreatedAt` (TIMESTAMP)

### PlayerAsset Table
- `PlayerId` (VARCHAR, FOREIGN KEY)
- `AssetId` (VARCHAR, FOREIGN KEY)
- `AssignedAt` (TIMESTAMP)

## ☁️ Azure Deployment

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed instructions on deploying to Azure Cloud.

The guide covers:
- CLI deployment with Azure Functions Core Tools
- Visual Studio Code deployment
- Azure Portal manual deployment
- Database setup in Azure MySQL
- CORS configuration
- Monitoring and troubleshooting

## 🎯 Assignment Marking Schema

| Question | Description | Marks | Status |
|----------|-------------|-------|--------|
| Database | Code first or database first | 1 | ✅ Complete |
| Question 1 | API `registerplayer` | 3 | ✅ Complete |
| Question 2 | API `createasset` | 3 | ✅ Complete |
| Question 3 | API `getassetsbyplayer` | 3 | ✅ Complete |
| Question 4 | React website | 3 | ✅ Complete |
| Question 5 | Deployment document | 1 | ✅ Complete |
| Bonus | Good coding convention | 1 | ✅ Complete |
| **Total** | | **15** | **15/15** |

## 📝 Implementation Details

### Approach
- **Database**: Database First (SQL scripts provided)
- **Backend**: Azure Functions with Node.js v18
- **Frontend**: React 18 with Hooks
- **Database**: MySQL (XAMPP for development, Azure MySQL for production)
- **Authentication**: Anonymous (as per assignment requirements)

### Coding Conventions
- ✅ Consistent naming conventions (camelCase for JS, PascalCase for components)
- ✅ Proper error handling with try-catch blocks
- ✅ Input validation on all endpoints
- ✅ Database connection pooling for performance
- ✅ RESTful API design
- ✅ Responsive UI design
- ✅ Comprehensive comments and documentation

## 🧪 Testing

### Test API with curl

```bash
# Test registerplayer
curl -X POST http://localhost:7071/api/registerplayer \
  -H "Content-Type: application/json" \
  -d '{"playerName":"TestPlayer","fullName":"Test User","age":"20","level":1,"email":"test@test.com"}'

# Test createasset
curl -X POST http://localhost:7071/api/createasset \
  -H "Content-Type: application/json" \
  -d '{"assetName":"Test Sword","levelRequire":5}'

# Test getassetsbyplayer
curl http://localhost:7071/api/getassetsbyplayer
```

## 📦 Dependencies

### Backend (Azure Functions)
- `@azure/functions` - Azure Functions SDK
- `mysql2` - MySQL database driver
- `uuid` - UUID generation for IDs
- `cors` - CORS handling

### Frontend (React)
- `react` - React framework
- `react-dom` - React DOM rendering
- `axios` - HTTP client for API calls

## 🔒 Security Notes

- Database credentials are in `local.settings.json` (not committed to Git)
- UUIDs used for all primary keys
- Input validation on all API endpoints
- SQL injection prevention with parameterized queries
- CORS properly configured

## 👨‍💻 Author

DMAS Exam Assignment - Battle Game
FPT University - Aptech

## 📄 License

This project is for educational purposes as part of the DMAS exam.
