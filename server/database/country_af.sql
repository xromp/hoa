-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2020 at 01:10 AM
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
-- Database: `axess_live`
--

-- --------------------------------------------------------

--
-- Table structure for table `country_af`
--

CREATE TABLE `country_af` (
  `id` int(11) NOT NULL,
  `country_master_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `code` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `country_af`
--

INSERT INTO `country_af` (`id`, `country_master_id`, `name`, `code`) VALUES
(1, 4, 'Algeria', 'DZ'),
(2, 7, 'Angola', 'AO'),
(3, 24, 'Benin', 'BJ'),
(4, 30, 'Botswana', 'BW'),
(5, 36, 'Burkina Faso', 'BF'),
(6, 37, 'Burundi', 'BI'),
(7, 39, 'Cameroon', 'CM'),
(8, 41, 'Cape Verde', 'CV'),
(9, 43, 'Central African Republic', 'CF'),
(10, 44, 'Chad', 'TD'),
(11, 50, 'Comoros', 'KM'),
(12, 51, 'Congo', 'CG'),
(13, 52, 'Congo, the Democratic Republic of the', 'CD'),
(14, 62, 'Djibouti', 'DJ'),
(15, 66, 'Egypt', 'EG'),
(16, 68, 'Equatorial Guinea', 'GQ'),
(17, 69, 'Eritrea', 'ER'),
(18, 71, 'Ethiopia', 'ET'),
(19, 80, 'Gabon', 'GA'),
(20, 81, 'Gambia', 'GM'),
(21, 84, 'Ghana', 'GH'),
(22, 93, 'Guinea', 'GN'),
(23, 94, 'Guinea-Bissau', 'GW'),
(24, 0, 'Ivory Coast', '#N/A'),
(25, 116, 'Kenya', 'KE'),
(26, 125, 'Lesotho', 'LS'),
(27, 126, 'Liberia', 'LR'),
(28, 127, 'Libya', 'LY'),
(29, 133, 'Madagascar', 'MG'),
(30, 134, 'Malawi', 'MW'),
(31, 137, 'Mali', 'ML'),
(32, 141, 'Mauritania', 'MR'),
(33, 142, 'Mauritius', 'MU'),
(34, 151, 'Morocco', 'MA'),
(35, 152, 'Mozambique', 'MZ'),
(36, 154, 'Namibia', 'NA'),
(37, 161, 'Niger', 'NE'),
(38, 162, 'Nigeria', 'NG'),
(39, 184, 'Rwanda', 'RW'),
(40, 194, 'Sao Tome and Principe', 'ST'),
(41, 196, 'Senegal', 'SN'),
(42, 198, 'Seychelles', 'SC'),
(43, 199, 'Sierra Leone', 'SL'),
(44, 205, 'Somalia', 'SO'),
(45, 206, 'South Africa', 'ZA'),
(46, 208, 'South Sudan', 'SS'),
(47, 211, 'Sudan', 'SD'),
(48, 214, 'Swaziland', 'SZ'),
(49, 220, 'Tanzania, United Republic of', 'TZ'),
(50, 223, 'Togo', 'TG'),
(51, 227, 'Tunisia', 'TN'),
(52, 232, 'Uganda', 'UG'),
(53, 248, 'Zambia', 'ZM'),
(54, 249, 'Zimbabwe', 'ZW');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `country_af`
--
ALTER TABLE `country_af`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `country_af`
--
ALTER TABLE `country_af`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
