-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2020 at 01:14 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `axess_axp3a`
--

-- --------------------------------------------------------

--
-- Table structure for table `vendor_category_master`
--

CREATE TABLE `vendor_category_master` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` date NOT NULL,
  `description` text DEFAULT NULL,
  `updatedAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vendor_category_master`
--

INSERT INTO `vendor_category_master` (`id`, `name`, `createdAt`, `description`, `updatedAt`) VALUES
(1, 'Plumbing and Cleaning', '0000-00-00', 'Description...', '0000-00-00'),
(2, 'HVAC', '0000-00-00', 'Description of HVAC Services.', '0000-00-00'),
(3, 'Electrical', '0000-00-00', 'Electrician services', '0000-00-00'),
(4, 'AC/heating', '0000-00-00', '', '0000-00-00'),
(5, 'Appliance Repair', '0000-00-00', '', '0000-00-00'),
(6, 'Audio / Video', '0000-00-00', '', '0000-00-00'),
(7, 'Car/Cab Service', '0000-00-00', '', '0000-00-00'),
(8, 'Carpentry\\ doors\\ ', '0000-00-00', '', '0000-00-00'),
(9, 'Drywall', '0000-00-00', '', '0000-00-00'),
(10, 'Concrete/ Brick/ Block', '0000-00-00', '', '0000-00-00'),
(11, 'Deck and Fence', '0000-00-00', '', '0000-00-00'),
(12, 'Electrical', '0000-00-00', '', '0000-00-00'),
(13, 'Elevator', '0000-00-00', '', '0000-00-00'),
(14, 'Fitness', '0000-00-00', '', '0000-00-00'),
(15, 'Flooring', '0000-00-00', '', '0000-00-00'),
(16, 'Furnishings', '0000-00-00', '', '0000-00-00'),
(17, 'General contractor', '0000-00-00', '', '0000-00-00'),
(18, 'Handyman', '0000-00-00', '', '0000-00-00'),
(19, 'Housekeeping (cleaning)', '0000-00-00', '', '0000-00-00'),
(20, 'Insurance', '0000-00-00', '', '0000-00-00'),
(21, 'Interior Design', '0000-00-00', '', '0000-00-00'),
(22, 'Landscaping', '0000-00-00', '', '0000-00-00'),
(23, 'Laundry (Dry Cleaning) Services', '0000-00-00', '', '0000-00-00'),
(24, 'Locksmith', '0000-00-00', '', '0000-00-00'),
(25, 'Moving and storage', '0000-00-00', '', '0000-00-00'),
(26, 'Painting', '0000-00-00', '', '0000-00-00'),
(27, 'Pet Services', '0000-00-00', '', '0000-00-00'),
(28, 'Photography', '0000-00-00', '', '0000-00-00'),
(29, 'Plumbing', '0000-00-00', '', '0000-00-00'),
(30, 'Real estate', '0000-00-00', '', '0000-00-00'),
(31, 'Roofing', '0000-00-00', '', '0000-00-00'),
(32, 'Security', '0000-00-00', '', '0000-00-00'),
(33, 'Utilities', '0000-00-00', '', '0000-00-00'),
(34, 'Windows', '0000-00-00', '', '0000-00-00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vendor_category_master`
--
ALTER TABLE `vendor_category_master`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vendor_category_master`
--
ALTER TABLE `vendor_category_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
