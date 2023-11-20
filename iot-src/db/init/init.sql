-- MySQL dump 10.13  Distrib 8.0.12, for macos10.13 (x86_64)
--
-- Host: localhost    Database: agro_iot
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
CREATE SCHEMA IF NOT EXISTS `agro_iot` DEFAULT CHARACTER SET utf8 ; 
SET NAMES utf8;
USE `agro_iot` ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



--
-- Table structure for table `applicationuser`
--

-- DROP TABLE IF EXISTS `applicationuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `applicationuser` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `created_by` bigint NOT NULL,
  `edited_by` bigint DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `FK_User_Role` (`role_id`),
  CONSTRAINT `FK_User_Role` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicationuser`
--

LOCK TABLES `applicationuser` WRITE;
/*!40000 ALTER TABLE `applicationuser` DISABLE KEYS */;
INSERT INTO `applicationuser` VALUES (1,'2023-06-06 22:43:02.000000',1,NULL,0,NULL,'gussiciliano@gmail.com',_binary '','Gustavo','$2a$10$WhLO7aI6oqXxm.SY1lr8JezChmVWfM60PcuvXvRDQDa15oGKTE5CC','Siciliano','admin',1);
/*!40000 ALTER TABLE `applicationuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `garden`
--

-- DROP TABLE IF EXISTS `garden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `garden` (
  `garden_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `created_by` bigint NOT NULL,
  `edited_by` bigint DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `owner_user_id` bigint NOT NULL,
  PRIMARY KEY (`garden_id`),
  KEY `FK_Garden_User` (`owner_user_id`),
  CONSTRAINT `FK_Garden_User` FOREIGN KEY (`owner_user_id`) REFERENCES `applicationuser` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `garden`
--

LOCK TABLES `garden` WRITE;
/*!40000 ALTER TABLE `garden` DISABLE KEYS */;
/*!40000 ALTER TABLE `garden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metric_acceptation_range`
--

-- DROP TABLE IF EXISTS `metric_acceptation_range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `metric_acceptation_range` (
  `metric_acceptation_range_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `created_by` bigint NOT NULL,
  `edited_by` bigint DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` datetime(6) DEFAULT NULL,
  `end_value` double DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start_value` double DEFAULT NULL,
  `metric_type_id` varchar(255) NOT NULL,
  `owner_user_id` bigint NOT NULL,
  PRIMARY KEY (`metric_acceptation_range_id`),
  KEY `FK_MetricAcceptationRange_MetricType` (`metric_type_id`),
  KEY `FK_MetricAcceptationRange_User` (`owner_user_id`),
  CONSTRAINT `FK_MetricAcceptationRange_MetricType` FOREIGN KEY (`metric_type_id`) REFERENCES `metric_type` (`code`),
  CONSTRAINT `FK_MetricAcceptationRange_User` FOREIGN KEY (`owner_user_id`) REFERENCES `applicationuser` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metric_acceptation_range`
--

LOCK TABLES `metric_acceptation_range` WRITE;
/*!40000 ALTER TABLE `metric_acceptation_range` DISABLE KEYS */;
/*!40000 ALTER TABLE `metric_acceptation_range` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metric_reading`
--

-- DROP TABLE IF EXISTS `metric_reading`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `metric_reading` (
  `metric_reading_id` bigint NOT NULL AUTO_INCREMENT,
  `reading_date` datetime(6) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `value_type` varchar(255) DEFAULT NULL,
  `metric_type_id` varchar(255) NOT NULL,
  `sector_id` bigint NOT NULL,
  PRIMARY KEY (`metric_reading_id`),
  KEY `FK_MetricReading_MetricType` (`metric_type_id`),
  KEY `FK_MetricReading_Sector` (`sector_id`),
  CONSTRAINT `FK_MetricReading_MetricType` FOREIGN KEY (`metric_type_id`) REFERENCES `metric_type` (`code`),
  CONSTRAINT `FK_MetricReading_Sector` FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metric_reading`
--

LOCK TABLES `metric_reading` WRITE;
/*!40000 ALTER TABLE `metric_reading` DISABLE KEYS */;
/*!40000 ALTER TABLE `metric_reading` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metric_type`
--

-- DROP TABLE IF EXISTS `metric_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `metric_type` (
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metric_type`
--

LOCK TABLES `metric_type` WRITE;
/*!40000 ALTER TABLE `metric_type` DISABLE KEYS */;
INSERT INTO `agro_iot`.`metric_type` (`code`, `description`) VALUES ('ta', 'Temperatura ambiente');
INSERT INTO `agro_iot`.`metric_type` (`code`, `description`) VALUES ('hr', 'Humedad relativa');
INSERT INTO `agro_iot`.`metric_type` (`code`, `description`) VALUES ('hs', 'Humedad sustrato');
/*!40000 ALTER TABLE `metric_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

-- DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `role` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `created_by` bigint NOT NULL,
  `edited_by` bigint DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` datetime(6) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'2023-06-06 22:43:02.000000',1,NULL,0,NULL,'ADMIN','Administrador'),(2,'2023-06-06 22:43:02.000000',1,NULL,0,NULL,'GARDEN_MANAGER','Gestor de Huertas'),(3,'2023-06-06 22:43:02.000000',1,NULL,0,NULL,'VISITOR','Visitante');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector`
--

-- DROP TABLE IF EXISTS `sector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sector` (
  `sector_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `created_by` bigint NOT NULL,
  `edited_by` bigint DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` datetime(6) DEFAULT NULL,
  `centralizer_key` varchar(255) DEFAULT NULL,
  `crops` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `garden_id` bigint NOT NULL,
  PRIMARY KEY (`sector_id`),
  KEY `FK_Garden_Sector` (`garden_id`),
  CONSTRAINT `FK_Garden_Sector` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`garden_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector`
--

LOCK TABLES `sector` WRITE;
/*!40000 ALTER TABLE `sector` DISABLE KEYS */;
/*!40000 ALTER TABLE `sector` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sector_metric_acceptation_range`
--

-- DROP TABLE IF EXISTS `sector_metric_acceptation_range`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sector_metric_acceptation_range` (
  `sector_id` bigint NOT NULL,
  `metric_acceptation_range_id` bigint NOT NULL,
  PRIMARY KEY (`sector_id`,`metric_acceptation_range_id`),
  KEY `FKh989g0mxnet3wior9ieubyyet` (`metric_acceptation_range_id`),
  CONSTRAINT `FKcy5j9g92bvrlfkbsmq4fp1t8n` FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`),
  CONSTRAINT `FKh989g0mxnet3wior9ieubyyet` FOREIGN KEY (`metric_acceptation_range_id`) REFERENCES `metric_acceptation_range` (`metric_acceptation_range_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sector_metric_acceptation_range`
--

LOCK TABLES `sector_metric_acceptation_range` WRITE;
/*!40000 ALTER TABLE `sector_metric_acceptation_range` DISABLE KEYS */;
/*!40000 ALTER TABLE `sector_metric_acceptation_range` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

-- DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `session` (
  `session_id` bigint NOT NULL AUTO_INCREMENT,
  `expires_at` datetime(6) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `issued_at` datetime(6) DEFAULT NULL,
  `token` varchar(400) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `FK_Session_User` (`user_id`),
  CONSTRAINT `FK_Session_User` FOREIGN KEY (`user_id`) REFERENCES `applicationuser` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (1,'2023-06-07 22:55:23.453000',_binary '\0','2023-06-06 22:55:23.501973','eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJlbWFpbCI6IlN0ZXJsaW5nLktvdmFjZWtAeWFob28uY29tIiwidXNlcm5hbWUiOiJkb2d1aWRvZ3VpIiwic3ViIjoiMSIsImlhdCI6MTY4NjEwMjkyMywiZXhwIjoxNjg2MTg5MzIzfQ.cX48chf5Ds8sQHVTZwu1DY4B7QM3GNwvv_tEyIK4ZtSDDp0LKktEV7mjgZf0eaTx96iHuVZnXCY5aNKtaN0OpA',1);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'agro_iot'
--

--
-- Dumping routines for database 'agro_iot'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-12 23:14:21
