# API Testing Guide

This document provides commands to test all three APIs.

## Prerequisites

1. XAMPP MySQL is running
2. Azure Functions backend is running (`cd azure-functions && npm start`)
3. Database is set up with sample data

## Test Commands

### 1. Test Get Assets By Player (GET)

This should return all player assets from the sample data:

```bash
curl http://localhost:7071/api/getassetsbyplayer
```

**Expected Response:**
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
    },
    {
      "no": 2,
      "playerName": "Player1",
      "level": 10,
      "age": "20",
      "assetName": "Sword of Destiny"
    },
    ...
  ]
}
```

### 2. Test Register Player (POST)

Create a new player:

```bash
curl -X POST http://localhost:7071/api/registerplayer ^
  -H "Content-Type: application/json" ^
  -d "{\"playerName\":\"Player5\",\"fullName\":\"Alice Wonder\",\"age\":\"22\",\"level\":3,\"email\":\"alice@game.com\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Player registered successfully",
  "data": {
    "playerId": "some-uuid",
    "playerName": "Player5",
    "fullName": "Alice Wonder",
    "age": "22",
    "level": 3,
    "email": "alice@game.com"
  }
}
```

### 3. Test Create Asset (POST)

Create a new asset:

```bash
curl -X POST http://localhost:7071/api/createasset ^
  -H "Content-Type: application/json" ^
  -d "{\"assetName\":\"Magic Wand\",\"levelRequire\":8}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Asset created successfully",
  "data": {
    "assetId": "some-uuid",
    "assetName": "Magic Wand",
    "levelRequire": 8
  }
}
```

## Test Error Cases

### Register Player with Duplicate Name

```bash
curl -X POST http://localhost:7071/api/registerplayer ^
  -H "Content-Type: application/json" ^
  -d "{\"playerName\":\"Player1\",\"fullName\":\"Duplicate Test\",\"age\":\"25\",\"level\":1,\"email\":\"dup@test.com\"}"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Player name already exists"
}
```

### Register Player with Missing Fields

```bash
curl -X POST http://localhost:7071/api/registerplayer ^
  -H "Content-Type: application/json" ^
  -d "{\"playerName\":\"TestPlayer\"}"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Missing required fields: playerName, fullName, age, email"
}
```

### Create Asset with Invalid Level

```bash
curl -X POST http://localhost:7071/api/createasset ^
  -H "Content-Type: application/json" ^
  -d "{\"assetName\":\"Invalid Asset\",\"levelRequire\":\"not-a-number\"}"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "levelRequire must be a valid positive number"
}
```

## Test with PowerShell

If `curl` doesn't work in your terminal, use PowerShell:

### Get Assets By Player
```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/getassetsbyplayer" -Method Get
```

### Register Player
```powershell
$body = @{
    playerName = "Player6"
    fullName = "Bob Smith"
    age = "28"
    level = 5
    email = "bob@game.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:7071/api/registerplayer" -Method Post -Body $body -ContentType "application/json"
```

### Create Asset
```powershell
$body = @{
    assetName = "Fire Bow"
    levelRequire = 12
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:7071/api/createasset" -Method Post -Body $body -ContentType "application/json"
```

## Verify Data in Database

After creating new players and assets, verify in MySQL:

```bash
mysql -u root -e "USE BATTLEGAME; SELECT * FROM Player;"
mysql -u root -e "USE BATTLEGAME; SELECT * FROM Asset;"
```

## Test React Frontend

1. Open browser to `http://localhost:3000`
2. The table should display all player assets
3. Click the Refresh button to reload data
4. Verify the table shows:
   - No column
   - Player Name
   - Level
   - Age
   - Asset Name

## Quick Test All

Run this to test all three endpoints quickly:

```bash
echo "Testing Get Assets By Player..."
curl http://localhost:7071/api/getassetsbyplayer

echo "\n\nTesting Register Player..."
curl -X POST http://localhost:7071/api/registerplayer -H "Content-Type: application/json" -d "{\"playerName\":\"TestUser\",\"fullName\":\"Test User\",\"age\":\"25\",\"level\":1,\"email\":\"test@test.com\"}"

echo "\n\nTesting Create Asset..."
curl -X POST http://localhost:7071/api/createasset -H "Content-Type: application/json" -d "{\"assetName\":\"Test Item\",\"levelRequire\":1}"
```

## Expected Results Summary

✅ All three APIs should return 2xx status codes  
✅ GET `/getassetsbyplayer` returns array of player assets  
✅ POST `/registerplayer` creates new player with UUID  
✅ POST `/createasset` creates new asset with UUID  
✅ Error cases return appropriate 4xx status codes  
✅ React frontend displays data from GET endpoint
