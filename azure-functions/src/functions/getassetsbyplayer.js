const { app } = require('@azure/functions');
const { executeQuery } = require('../db');

/**
 * Get Assets By Player API
 * GET /api/getassetsbyplayer
 * Returns a list of all players with their assets
 */
app.http('getassetsbyplayer', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Get Assets By Player API invoked');

        try {
            // Query to join Player, PlayerAsset, and Asset tables
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

            // Transform results to match the required format
            const formattedResults = results.map((row, index) => ({
                no: index + 1,
                playerName: row.playerName,
                level: row.level,
                age: row.age,
                assetName: row.assetName
            }));

            context.log(`Retrieved ${formattedResults.length} player asset records`);

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                jsonBody: {
                    success: true,
                    count: formattedResults.length,
                    data: formattedResults
                }
            };

        } catch (error) {
            context.error('Error fetching player assets:', error);

            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                jsonBody: {
                    success: false,
                    message: 'Internal server error',
                    error: error.message
                }
            };
        }
    }
});
