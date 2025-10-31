# Azure Functions Deployment Guide

This document provides step-by-step instructions for deploying the Battle Game Azure Functions to Microsoft Azure.

## Prerequisites

Before deploying, ensure you have:

1. **Azure Account** - Sign up at [azure.microsoft.com](https://azure.microsoft.com)
2. **Azure CLI** - Download from [docs.microsoft.com/cli/azure/install-azure-cli](https://docs.microsoft.com/cli/azure/install-azure-cli)
3. **Azure Functions Core Tools** - Install via npm:
   ```bash
   npm install -g azure-functions-core-tools@4
   ```
4. **Visual Studio Code** (Optional but recommended)
   - Azure Functions extension
   - Azure Account extension

## Method 1: Deploy Using Azure Functions Core Tools (CLI)

### Step 1: Login to Azure

Open your terminal and login to Azure:

```bash
az login
```

This will open your browser for authentication.

### Step 2: Create a Resource Group

```bash
az group create --name battlegame-rg --location eastus
```

### Step 3: Create a Storage Account

Storage account is required for Azure Functions:

```bash
az storage account create \
  --name battlegamestorage \
  --location eastus \
  --resource-group battlegame-rg \
  --sku Standard_LRS
```

### Step 4: Create the Function App

```bash
az functionapp create \
  --resource-group battlegame-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name battlegame-functions \
  --storage-account battlegamestorage
```

### Step 5: Create Azure Database for MySQL

Option A: **Azure Database for MySQL Flexible Server**

```bash
az mysql flexible-server create \
  --resource-group battlegame-rg \
  --name battlegame-mysql \
  --location eastus \
  --admin-user azureuser \
  --admin-password {{your-secure-password}} \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 8.0
```

Option B: **Use existing XAMPP database** (for development only)
- Keep using localhost MySQL
- Ensure your Azure Functions can connect (not recommended for production)

### Step 6: Configure Application Settings

Set environment variables for the Function App:

```bash
az functionapp config appsettings set \
  --name battlegame-functions \
  --resource-group battlegame-rg \
  --settings \
    "DB_HOST=battlegame-mysql.mysql.database.azure.com" \
    "DB_USER=azureuser" \
    "DB_PASSWORD={{your-secure-password}}" \
    "DB_NAME=BATTLEGAME" \
    "DB_PORT=3306"
```

### Step 7: Configure Firewall Rules

Allow Azure services to access your MySQL database:

```bash
az mysql flexible-server firewall-rule create \
  --resource-group battlegame-rg \
  --name battlegame-mysql \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Step 8: Import Database Schema

Connect to Azure MySQL and run your SQL scripts:

```bash
mysql -h battlegame-mysql.mysql.database.azure.com \
  -u azureuser \
  -p \
  < database/create_database.sql
```

### Step 9: Deploy the Function App

Navigate to your azure-functions directory and deploy:

```bash
cd azure-functions
func azure functionapp publish battlegame-functions
```

### Step 10: Test Your Deployment

After deployment, your functions will be available at:

```
https://battlegame-functions.azurewebsites.net/api/registerplayer
https://battlegame-functions.azurewebsites.net/api/createasset
https://battlegame-functions.azurewebsites.net/api/getassetsbyplayer
```

Test with curl:

```bash
curl https://battlegame-functions.azurewebsites.net/api/getassetsbyplayer
```

---

## Method 2: Deploy Using Visual Studio Code

### Step 1: Install VS Code Extensions

1. Open VS Code
2. Install the following extensions:
   - **Azure Functions**
   - **Azure Account**

### Step 2: Sign in to Azure

1. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
2. Type "Azure: Sign In"
3. Follow the authentication prompts

### Step 3: Create Function App

1. Click the Azure icon in the left sidebar
2. In the Functions section, click the "+" icon
3. Select "Create Function App in Azure (Advanced)"
4. Follow the wizard:
   - Enter a name: `battlegame-functions`
   - Select runtime: **Node.js 18 LTS**
   - Select OS: **Linux**
   - Select hosting plan: **Consumption**
   - Create new resource group: `battlegame-rg`
   - Create new storage account: `battlegamestorage`
   - Select location: **East US**

### Step 4: Deploy Functions

1. Right-click on the `azure-functions` folder in VS Code
2. Select "Deploy to Function App..."
3. Choose the function app you created: `battlegame-functions`
4. Confirm the deployment

### Step 5: Configure Application Settings in Portal

1. Go to [portal.azure.com](https://portal.azure.com)
2. Navigate to your Function App: `battlegame-functions`
3. Go to **Configuration** → **Application settings**
4. Add the following settings:
   - `DB_HOST`: your-mysql-server.mysql.database.azure.com
   - `DB_USER`: azureuser
   - `DB_PASSWORD`: your-password
   - `DB_NAME`: BATTLEGAME
   - `DB_PORT`: 3306
5. Click **Save**

### Step 6: Restart Function App

After configuration changes, restart the function app from the Azure portal.

---

## Method 3: Deploy Using Azure Portal (Manual)

### Step 1: Create Resources in Portal

1. Go to [portal.azure.com](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Function App"
4. Fill in the details:
   - **Resource Group**: Create new → `battlegame-rg`
   - **Function App name**: `battlegame-functions`
   - **Runtime stack**: Node.js
   - **Version**: 18 LTS
   - **Region**: East US
   - **Plan type**: Consumption (Serverless)
5. Click "Review + create" → "Create"

### Step 2: Upload Function Code

1. Navigate to your Function App in the portal
2. Go to **Deployment Center**
3. Choose deployment source:
   - **Local Git** (recommended for learning)
   - **GitHub** (for production)
   - **OneDrive**
   - **External Git**
4. Follow the instructions to push your code

### Step 3: Configure Environment Variables

Same as Method 2, Step 5.

---

## Post-Deployment Configuration

### Enable CORS for React Frontend

If your React app is on a different domain:

```bash
az functionapp cors add \
  --name battlegame-functions \
  --resource-group battlegame-rg \
  --allowed-origins http://localhost:3000 https://your-react-app.com
```

Or configure in Azure Portal:
1. Go to Function App → **CORS**
2. Add allowed origins

### Monitor Your Functions

1. Go to Function App → **Monitor**
2. View logs, metrics, and application insights

### View Logs in Real-time

```bash
func azure functionapp logstream battlegame-functions
```

---

## Update React App API URL

After deployment, update your React app's API URL:

In `battlegame-app/src/App.js`:

```javascript
const API_BASE_URL = 'https://battlegame-functions.azurewebsites.net/api';
```

---

## Cost Management

### Consumption Plan Pricing

- **First 1 million executions**: FREE
- **After 1 million**: $0.20 per million executions
- **Execution time**: $0.000016 per GB-s

### MySQL Database Pricing

- **Burstable tier (B1ms)**: ~$12/month
- **Free tier available**: 750 hours/month for 12 months

---

## Troubleshooting

### Function Returns 500 Error

1. Check application logs:
   ```bash
   func azure functionapp logstream battlegame-functions
   ```

2. Verify database connection:
   - Check firewall rules
   - Verify credentials in Application Settings

### Database Connection Failed

1. Add your IP to MySQL firewall rules:
   ```bash
   az mysql flexible-server firewall-rule create \
     --resource-group battlegame-rg \
     --name battlegame-mysql \
     --rule-name AllowMyIP \
     --start-ip-address YOUR_IP \
     --end-ip-address YOUR_IP
   ```

### CORS Errors in React App

1. Enable CORS in Function App settings
2. Add your React app domain to allowed origins

---

## Clean Up Resources

To avoid charges, delete the resource group when done:

```bash
az group delete --name battlegame-rg --yes --no-wait
```

---

## Additional Resources

- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Azure Database for MySQL Documentation](https://docs.microsoft.com/azure/mysql/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

---

## Summary

This guide covered three methods to deploy Azure Functions:

1. ✅ **CLI Method** - Best for automation and CI/CD
2. ✅ **VS Code Method** - Best for development workflow
3. ✅ **Portal Method** - Best for learning and visualization

Choose the method that best fits your workflow and requirements.

**Note**: Remember to secure your database credentials and never commit them to version control!
