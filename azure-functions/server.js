const express = require('express');
const cors = require('cors');
const { executeQuery } = require('./src/db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 7071;

// Middleware
app.use(cors());
app.use(express.json());

// Mock context for Azure Functions
const createContext = () => ({
    log: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args)
});

// Register Player API
app.post('/api/registerplayer', async (req, res) => {
    const context = createContext();
    context.log('Register Player API invoked');

    try {
        const body = req.body;
        const { playerName, fullName, age, level, email } = body;

        if (!playerName || !fullName || !age || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: playerName, fullName, age, email'
            });
        }

        const playerId = uuidv4();
        const playerLevel = level || 1;

        const query = `
            INSERT INTO Player (PlayerId, PlayerName, FullName, Age, \`Level\`, Email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        await executeQuery(query, [playerId, playerName, fullName, age, playerLevel, email]);

        context.log(`Player registered successfully: ${playerName}`);

        res.status(201).json({
            success: true,
            message: 'Player registered successfully',
            data: {
                playerId,
                playerName,
                fullName,
                age,
                level: playerLevel,
                email
            }
        });

    } catch (error) {
        context.error('Error registering player:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Player name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Create Asset API
app.post('/api/createasset', async (req, res) => {
    const context = createContext();
    context.log('Create Asset API invoked');

    try {
        const body = req.body;
        const { assetName, levelRequire } = body;

        if (!assetName || levelRequire === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: assetName, levelRequire'
            });
        }

        const level = parseInt(levelRequire);
        if (isNaN(level) || level < 0) {
            return res.status(400).json({
                success: false,
                message: 'levelRequire must be a valid positive number'
            });
        }

        const assetId = uuidv4();

        const query = `
            INSERT INTO Asset (AssetId, AssetName, LevelRequire)
            VALUES (?, ?, ?)
        `;
        
        await executeQuery(query, [assetId, assetName, level]);

        context.log(`Asset created successfully: ${assetName}`);

        res.status(201).json({
            success: true,
            message: 'Asset created successfully',
            data: {
                assetId,
                assetName,
                levelRequire: level
            }
        });

    } catch (error) {
        context.error('Error creating asset:', error);

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get Assets By Player API
app.get('/api/getassetsbyplayer', async (req, res) => {
    const context = createContext();
    context.log('Get Assets By Player API invoked');

    try {
        const query = `
            SELECT 
                p.PlayerName as playerName,
                p.\`Level\` as level,
                p.Age as age,
                a.AssetName as assetName
            FROM Player p
            INNER JOIN PlayerAsset pa ON p.PlayerId = pa.PlayerId
            INNER JOIN Asset a ON pa.AssetId = a.AssetId
            ORDER BY p.PlayerName, a.AssetName
        `;
        
        const results = await executeQuery(query);

        const formattedResults = results.map((row, index) => ({
            no: index + 1,
            playerName: row.playerName,
            level: row.level,
            age: row.age,
            assetName: row.assetName
        }));

        context.log(`Retrieved ${formattedResults.length} player asset records`);

        res.status(200).json({
            success: true,
            count: formattedResults.length,
            data: formattedResults
        });

    } catch (error) {
        context.error('Error fetching player assets:', error);

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Battle Game API Server',
        status: 'running',
        endpoints: [
            'POST /api/registerplayer',
            'POST /api/createasset',
            'GET /api/getassetsbyplayer'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(60));
    console.log('🎮 Battle Game API Server');
    console.log('='.repeat(60));
    console.log('');
    console.log('Server running at: http://localhost:' + PORT);
    console.log('');
    console.log('Available endpoints:');
    console.log('  POST   http://localhost:' + PORT + '/api/registerplayer');
    console.log('  POST   http://localhost:' + PORT + '/api/createasset');
    console.log('  GET    http://localhost:' + PORT + '/api/getassetsbyplayer');
    console.log('');
    console.log('Press Ctrl+C to stop');
    console.log('='.repeat(60));
    console.log('');
});
