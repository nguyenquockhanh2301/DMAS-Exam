-- Sample data for BATTLEGAME database
USE BATTLEGAME;

-- Insert sample players
INSERT INTO Player (PlayerId, PlayerName, FullName, Age, `Level`, Email) VALUES
('P001', 'Player1', 'John Doe', '20', 10, 'player1@game.com'),
('P002', 'Player2', 'Jane Smith', '19', 3, 'player2@game.com'),
('P003', 'Player3', 'Mike Johnson', '23', 10, 'player3@game.com');

-- Insert sample assets
INSERT INTO Asset (AssetId, AssetName, LevelRequire) VALUES
('A001', 'Hero 1', 1),
('A002', 'Hero 2', 3),
('A003', 'Sword of Destiny', 5),
('A004', 'Shield of Protection', 2);

-- Assign assets to players
INSERT INTO PlayerAsset (PlayerId, AssetId) VALUES
('P001', 'A001'),
('P002', 'A002'),
('P003', 'A001'),
('P001', 'A003'),
('P003', 'A004');
