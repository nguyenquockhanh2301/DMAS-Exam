-- Create BATTLEGAME Database
CREATE DATABASE IF NOT EXISTS BATTLEGAME;
USE BATTLEGAME;

-- Drop tables if exist (for clean setup)
DROP TABLE IF EXISTS PlayerAsset;
DROP TABLE IF EXISTS Asset;
DROP TABLE IF EXISTS Player;

-- Create Player table
CREATE TABLE Player (
    PlayerId VARCHAR(64) PRIMARY KEY,
    PlayerName VARCHAR(64) NOT NULL UNIQUE,
    FullName VARCHAR(128) NOT NULL,
    Age VARCHAR(10) NOT NULL,
    `Level` INT NOT NULL DEFAULT 1,
    Email VARCHAR(64) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Asset table
CREATE TABLE Asset (
    AssetId VARCHAR(64) PRIMARY KEY,
    AssetName VARCHAR(64) NOT NULL,
    LevelRequire INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create PlayerAsset table (junction table)
CREATE TABLE PlayerAsset (
    PlayerId VARCHAR(64) NOT NULL,
    AssetId VARCHAR(64) NOT NULL,
    AssignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (PlayerId, AssetId),
    FOREIGN KEY (PlayerId) REFERENCES Player(PlayerId) ON DELETE CASCADE,
    FOREIGN KEY (AssetId) REFERENCES Asset(AssetId) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_player_name ON Player(PlayerName);
CREATE INDEX idx_asset_name ON Asset(AssetName);
CREATE INDEX idx_playerasset_player ON PlayerAsset(PlayerId);
CREATE INDEX idx_playerasset_asset ON PlayerAsset(AssetId);
