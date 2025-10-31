-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 31, 2025 at 03:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `battlegame`
--

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

CREATE TABLE `asset` (
  `AssetId` varchar(64) NOT NULL,
  `AssetName` varchar(64) NOT NULL,
  `LevelRequire` int(11) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asset`
--

INSERT INTO `asset` (`AssetId`, `AssetName`, `LevelRequire`, `CreatedAt`) VALUES
('1a020849-331d-432f-9855-0473ec5ccfeb', 'Excalibur', 4, '2025-10-31 12:37:19'),
('A001', 'Hero 1', 1, '2025-10-31 12:07:49'),
('A002', 'Hero 2', 3, '2025-10-31 12:07:49'),
('A003', 'Sword of Destiny', 5, '2025-10-31 12:07:49'),
('A004', 'Shield of Protection', 2, '2025-10-31 12:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE `player` (
  `PlayerId` varchar(64) NOT NULL,
  `PlayerName` varchar(64) NOT NULL,
  `FullName` varchar(128) NOT NULL,
  `Age` varchar(10) NOT NULL,
  `Level` int(11) NOT NULL DEFAULT 1,
  `Email` varchar(64) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `player`
--

INSERT INTO `player` (`PlayerId`, `PlayerName`, `FullName`, `Age`, `Level`, `Email`, `CreatedAt`) VALUES
('465f3540-33bb-4169-9d79-10b0d2f463c8', 'Shiro', 'White', '13', 4, 'quockhanh.nguyen2301@gmail.com', '2025-10-31 12:37:10'),
('P001', 'Player1', 'John Doe', '20', 10, 'player1@game.com', '2025-10-31 12:07:49'),
('P002', 'Player2', 'Jane Smith', '19', 3, 'player2@game.com', '2025-10-31 12:07:49'),
('P003', 'Player3', 'Mike Johnson', '23', 10, 'player3@game.com', '2025-10-31 12:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `playerasset`
--

CREATE TABLE `playerasset` (
  `PlayerId` varchar(64) NOT NULL,
  `AssetId` varchar(64) NOT NULL,
  `AssignedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `playerasset`
--

INSERT INTO `playerasset` (`PlayerId`, `AssetId`, `AssignedAt`) VALUES
('465f3540-33bb-4169-9d79-10b0d2f463c8', '1a020849-331d-432f-9855-0473ec5ccfeb', '2025-10-31 13:58:52'),
('465f3540-33bb-4169-9d79-10b0d2f463c8', 'A001', '2025-10-31 14:06:12'),
('P001', 'A001', '2025-10-31 12:07:49'),
('P001', 'A003', '2025-10-31 12:07:49'),
('P002', 'A002', '2025-10-31 12:07:49'),
('P003', 'A001', '2025-10-31 12:07:49'),
('P003', 'A004', '2025-10-31 12:07:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`AssetId`),
  ADD KEY `idx_asset_name` (`AssetName`);

--
-- Indexes for table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`PlayerId`),
  ADD UNIQUE KEY `PlayerName` (`PlayerName`),
  ADD KEY `idx_player_name` (`PlayerName`);

--
-- Indexes for table `playerasset`
--
ALTER TABLE `playerasset`
  ADD PRIMARY KEY (`PlayerId`,`AssetId`),
  ADD KEY `idx_playerasset_player` (`PlayerId`),
  ADD KEY `idx_playerasset_asset` (`AssetId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `playerasset`
--
ALTER TABLE `playerasset`
  ADD CONSTRAINT `playerasset_ibfk_1` FOREIGN KEY (`PlayerId`) REFERENCES `player` (`PlayerId`) ON DELETE CASCADE,
  ADD CONSTRAINT `playerasset_ibfk_2` FOREIGN KEY (`AssetId`) REFERENCES `asset` (`AssetId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
