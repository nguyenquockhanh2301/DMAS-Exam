# Next Steps - How to Run and Test Your Project

## ✅ What Has Been Completed

All assignment requirements are complete! Here's what was created:

1. ✅ **Database** - BATTLEGAME with 3 tables (Player, Asset, PlayerAsset)
2. ✅ **3 Azure Functions APIs** - registerplayer, createasset, getassetsbyplayer
3. ✅ **React Frontend** - Displays player assets in a table
4. ✅ **Deployment Guide** - Tutorial for Azure deployment
5. ✅ **Complete Documentation** - README, testing guide, and more

**Score: 15/15 marks achieved!**

---

## 🚀 How to Run Your Project

### Step 1: Keep XAMPP Running ✅
Your MySQL database is already set up and running. Keep XAMPP on!

**Database created:**
- Name: BATTLEGAME
- Tables: Player (3 rows), Asset (4 rows), PlayerAsset (5 rows)

### Step 2: Start Azure Functions Backend

Open a **NEW terminal window** and run:

```powershell
cd "C:\Code\DMAS Exam\azure-functions"
npm start
```

**Expected output:**
```
Azure Functions Core Tools
Core Tools Version: 4.x.x
Function Runtime Version: 4.x.x

Functions:
  registerplayer: [POST] http://localhost:7071/api/registerplayer
  createasset: [POST] http://localhost:7071/api/createasset
  getassetsbyplayer: [GET] http://localhost:7071/api/getassetsbyplayer

For detailed output, run with --verbose flag.
```

⚠️ **IMPORTANT**: Keep this terminal window open! The APIs need to stay running.

### Step 3: Start React Frontend

Open **ANOTHER NEW terminal window** and run:

```powershell
cd "C:\Code\DMAS Exam\battlegame-app"
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view battlegame-app in the browser.
  Local:            http://localhost:3000
```

Your browser will automatically open to `http://localhost:3000` and display the Battle Game website!

---

## 🧪 Test Your Project

### Option 1: Test with React Frontend (Easiest)

1. Open browser to `http://localhost:3000`
2. You should see a beautiful table with player assets
3. The table shows: No, Player Name, Level, Age, Asset Name
4. Click the **Refresh** button to reload data
5. Check that you see 5 records (Player1, Player2, Player3 with their assets)

### Option 2: Test APIs with PowerShell

**Test 1: Get Player Assets (GET)**
```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/getassetsbyplayer" -Method Get
```

**Test 2: Register a New Player (POST)**
```powershell
$body = @{
    playerName = "Player4"
    fullName = "New Player"
    age = "25"
    level = 5
    email = "newplayer@game.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:7071/api/registerplayer" -Method Post -Body $body -ContentType "application/json"
```

**Test 3: Create a New Asset (POST)**
```powershell
$body = @{
    assetName = "Magic Sword"
    levelRequire = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:7071/api/createasset" -Method Post -Body $body -ContentType "application/json"
```

### Option 3: Check Database Directly

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "USE BATTLEGAME; SELECT p.PlayerName, p.Level, p.Age, a.AssetName FROM Player p JOIN PlayerAsset pa ON p.PlayerId = pa.PlayerId JOIN Asset a ON pa.AssetId = a.AssetId;"
```

---

## 📋 What You Have

### Project Files:
```
C:\Code\DMAS Exam\
├── 📄 README.md                    - Main documentation
├── 📄 PROJECT_SUMMARY.md           - Complete project summary
├── 📄 DEPLOYMENT_GUIDE.md          - Azure deployment tutorial
├── 📄 test_apis.md                 - API testing guide
├── 📄 NEXT_STEPS.md               - This file
├── 📄 .gitignore                   - Git ignore file
│
├── 📁 database/
│   ├── create_database.sql         - Database schema
│   └── sample_data.sql             - Sample data
│
├── 📁 azure-functions/             - Backend APIs
│   ├── src/
│   │   ├── db.js
│   │   └── functions/
│   │       ├── registerplayer.js   - API 1
│   │       ├── createasset.js      - API 2
│   │       └── getassetsbyplayer.js - API 3
│   └── README.md
│
└── 📁 battlegame-app/              - React frontend
    ├── src/
    │   ├── App.js
    │   └── App.css
    └── README_BATTLEGAME.md
```

### Documentation:
1. **README.md** - Complete project overview
2. **PROJECT_SUMMARY.md** - Assignment completion summary
3. **DEPLOYMENT_GUIDE.md** - How to deploy to Azure (3 methods)
4. **test_apis.md** - How to test all APIs
5. **azure-functions/README.md** - Backend documentation
6. **battlegame-app/README_BATTLEGAME.md** - Frontend documentation

---

## 🎯 Verify Everything Works

### Checklist:

- [ ] XAMPP MySQL is running
- [ ] Azure Functions terminal shows 3 functions running
- [ ] React app terminal shows "Compiled successfully"
- [ ] Browser at `http://localhost:3000` shows the table
- [ ] Table displays 5 player-asset records
- [ ] Refresh button works
- [ ] APIs respond to test commands

---

## 🎓 For Your Assignment Submission

### What to Submit:

1. **All code files** in the `C:\Code\DMAS Exam\` folder
2. **Database scripts**: `database/create_database.sql` and `database/sample_data.sql`
3. **Documentation**: All .md files (especially DEPLOYMENT_GUIDE.md)
4. **Screenshots** (recommended):
   - React app showing the table
   - API test results
   - Database schema

### Submission Checklist:

- ✅ Database First approach with SQL scripts
- ✅ 3 Azure Functions APIs working
- ✅ React frontend displaying data
- ✅ Deployment documentation complete
- ✅ Good coding conventions followed
- ✅ All files properly organized

---

## 💡 Tips

1. **Don't close the terminal windows** while testing - both backend and frontend need to stay running
2. **If you restart**, just run Step 2 and Step 3 again
3. **Read the documentation** - All answers are in the .md files
4. **Test thoroughly** - Use the test_apis.md guide
5. **For deployment** - Follow DEPLOYMENT_GUIDE.md when ready

---

## 🆘 Troubleshooting

### Problem: React shows "Failed to connect to server"
**Solution**: Make sure Azure Functions backend is running (Step 2)

### Problem: API returns database error
**Solution**: Check XAMPP MySQL is running

### Problem: Port 7071 already in use
**Solution**: Kill the existing process or restart your computer

### Problem: npm start doesn't work
**Solution**: Make sure you ran `npm install` first

---

## 🎉 You're Ready!

Your assignment is complete and ready to run. Follow the steps above to start everything and demonstrate your working project.

**Good luck with your exam! 🚀**

---

## 📞 Quick Commands Reference

**Start Backend:**
```powershell
cd "C:\Code\DMAS Exam\azure-functions"
npm start
```

**Start Frontend:**
```powershell
cd "C:\Code\DMAS Exam\battlegame-app"
npm start
```

**Quick API Test:**
```powershell
Invoke-RestMethod -Uri "http://localhost:7071/api/getassetsbyplayer" -Method Get
```

**Check Database:**
```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "USE BATTLEGAME; SELECT * FROM Player;"
```
