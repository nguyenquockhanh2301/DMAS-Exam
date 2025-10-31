const { app } = require('@azure/functions');
const { executeQuery } = require('../db');

/**
 * Get Players API
 * GET /api/getplayers
 * Returns a list of player names
 */
app.http('getplayers', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Get Players API invoked');

        try {
            const query = `SELECT PlayerName FROM Player ORDER BY PlayerName`;
            const results = await executeQuery(query);

            const players = results.map(r => r.PlayerName);

            return {
                status: 200,
                jsonBody: {
                    success: true,
                    count: players.length,
                    data: players
                }
            };
        } catch (error) {
            context.error('Error fetching players:', error);
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
