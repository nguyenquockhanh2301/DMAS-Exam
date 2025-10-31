# Battle Game - Azure Functions Backend

This is the Azure Functions backend for the Battle Game assignment.

## Prerequisites

- Node.js (v18 or higher)
- Azure Functions Core Tools
- MySQL (via XAMPP)

## Installation

```bash
npm install
```

## Configuration

Update `local.settings.json` with your database credentials:

```json
{
  "Values": {
    "DB_HOST": "localhost",
    "DB_USER": "root",
    "DB_PASSWORD": "",
    "DB_NAME": "BATTLEGAME",
    "DB_PORT": "3306"
  }
}
```

## Running Locally

```bash
npm start
```

Or with Azure Functions Core Tools:

```bash
func start
```

## API Endpoints

### 1. Register Player
- **Endpoint**: `POST http://localhost:7071/api/registerplayer`
- **Body**:
```json
{
  "playerName": "Player4",
  "fullName": "John Doe",
  "age": "25",
  "level": 5,
  "email": "player4@game.com"
}
```

### 2. Create Asset
- **Endpoint**: `POST http://localhost:7071/api/createasset`
- **Body**:
```json
{
  "assetName": "Magic Sword",
  "levelRequire": 10
}
```

### 3. Get Assets By Player
- **Endpoint**: `GET http://localhost:7071/api/getassetsbyplayer`
- **Response**:
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

## Database Schema

See `../database/create_database.sql` for the complete schema.

## Deployment

See `../deployment-guide.md` for deployment instructions to Azure.
