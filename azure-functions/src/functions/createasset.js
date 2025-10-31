const { app } = require('@azure/functions');
const { executeQuery } = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Create Asset API
 * POST /api/createasset
 * Body: { assetName, levelRequire }
 */
app.http('createasset', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Create Asset API invoked');

        try {
            // Parse request body
            const body = await request.json();
            const { assetName, levelRequire } = body;

            // Validate required fields
            if (!assetName || levelRequire === undefined) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        message: 'Missing required fields: assetName, levelRequire'
                    }
                };
            }

            // Validate levelRequire is a number
            const level = parseInt(levelRequire);
            if (isNaN(level) || level < 0) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        message: 'levelRequire must be a valid positive number'
                    }
                };
            }

            // Generate unique AssetId
            const assetId = uuidv4();

            // Insert asset into database
            const query = `
                INSERT INTO Asset (AssetId, AssetName, LevelRequire)
                VALUES (?, ?, ?)
            `;
            
            await executeQuery(query, [assetId, assetName, level]);

            context.log(`Asset created successfully: ${assetName}`);

            return {
                status: 201,
                jsonBody: {
                    success: true,
                    message: 'Asset created successfully',
                    data: {
                        assetId,
                        assetName,
                        levelRequire: level
                    }
                }
            };

        } catch (error) {
            context.error('Error creating asset:', error);

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
