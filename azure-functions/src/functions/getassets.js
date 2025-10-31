const { app } = require('@azure/functions');
const { executeQuery } = require('../db');

/**
 * Get Assets API
 * GET /api/getassets
 * Returns a list of asset names
 */
app.http('getassets', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Get Assets API invoked');

        try {
            const query = `SELECT AssetName FROM Asset ORDER BY AssetName`;
            const results = await executeQuery(query);

            const assets = results.map(r => r.AssetName);

            return {
                status: 200,
                jsonBody: {
                    success: true,
                    count: assets.length,
                    data: assets
                }
            };
        } catch (error) {
            context.error('Error fetching assets:', error);
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
