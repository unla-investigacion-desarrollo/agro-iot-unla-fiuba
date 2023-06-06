CREATE DATABASE IF NOT EXISTS agro_iot;

USE agro_iot;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `Devices` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` varchar(128) NOT NULL,
  `state` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `range` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
