const { app } = require('@azure/functions');
const { executeQuery } = require('../db');

/**
 * Assign Asset To Player API
 * POST /api/assignasset
 * Body: { playerName, assetName }
 */
app.http('assignasset', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Assign Asset API invoked');

        try {
            const body = await request.json();
            const { playerName, assetName } = body;

            if (!playerName || !assetName) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        message: 'Missing required fields: playerName, assetName'
                    }
                };
            }

            // Get player by name
            const playerQuery = `SELECT PlayerId, ` + "`Level`" + ` as level FROM Player WHERE PlayerName = ?`;
            const players = await executeQuery(playerQuery, [playerName]);
            if (!players || players.length === 0) {
                return {
                    status: 404,
                    jsonBody: {
                        success: false,
                        message: 'Player not found'
                    }
                };
            }
            const player = players[0];

            // Get asset by name
            const assetQuery = `SELECT AssetId, LevelRequire FROM Asset WHERE AssetName = ?`;
            const assets = await executeQuery(assetQuery, [assetName]);
            if (!assets || assets.length === 0) {
                return {
                    status: 404,
                    jsonBody: {
                        success: false,
                        message: 'Asset not found'
                    }
                };
            }
            const asset = assets[0];

            // Check player's level requirement
            if (player.level < asset.LevelRequire) {
                return {
                    status: 400,
                    jsonBody: {
                        success: false,
                        message: `Player level ${player.level} does not meet required level ${asset.LevelRequire} for this asset`
                    }
                };
            }

            // Assign asset (insert into PlayerAsset)
            const insertQuery = `INSERT INTO PlayerAsset (PlayerId, AssetId) VALUES (?, ?)`;
            try {
                await executeQuery(insertQuery, [player.PlayerId, asset.AssetId]);
            } catch (err) {
                // Duplicate assignment
                if (err && err.code === 'ER_DUP_ENTRY') {
                    return {
                        status: 409,
                        jsonBody: {
                            success: false,
                            message: 'Asset already assigned to player'
                        }
                    };
                }
                throw err;
            }

            context.log(`Assigned asset '${assetName}' to player '${playerName}'`);

            return {
                status: 201,
                jsonBody: {
                    success: true,
                    message: 'Asset assigned to player successfully',
                    data: {
                        playerName,
                        assetName
                    }
                }
            };

        } catch (error) {
            context.error('Error assigning asset:', error);

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
