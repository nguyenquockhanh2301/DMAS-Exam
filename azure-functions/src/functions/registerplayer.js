const { app } = require('@azure/functions');
const { executeQuery } = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Register Player API
 * POST /api/registerplayer
 * Body: { playerName, fullName, age, level, email }
 */
app.http('registerplayer', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Register Player API invoked');

        try {
            // Parse request body
            const body = await request.json();
            const { playerName, fullName, age, level, email } = body;

            // Validate required fields
            if (!playerName || !fullName || !age || !email) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        message: 'Missing required fields: playerName, fullName, age, email'
                    }
                };
            }

            // Generate unique PlayerId
            const playerId = uuidv4();
            const playerLevel = level || 1;

            // Insert player into database
            const query = `
                INSERT INTO Player (PlayerId, PlayerName, FullName, Age, \`Level\`, Email)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            await executeQuery(query, [playerId, playerName, fullName, age, playerLevel, email]);

            context.log(`Player registered successfully: ${playerName}`);

            return {
                status: 201,
                jsonBody: {
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
                }
            };

        } catch (error) {
            context.error('Error registering player:', error);

            // Check for duplicate player name
            if (error.code === 'ER_DUP_ENTRY') {
                return {
                    status: 409,
                    jsonBody: {
                        success: false,
                        message: 'Player name already exists'
                    }
                };
            }

            return {
                status: 500,
                jsonBody: {
                    success: false,
                    message: 'Internal server error',
                    error: error.message
                }
            };
        }
    }
});
