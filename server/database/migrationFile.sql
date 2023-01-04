ALTER TABLE vendor ADD category_id int(11);
ALTER TABLE maintenance_request ADD title varchar(255);

ALTER TABLE `vendor` MODIFY `name` varchar(255) NULL
ALTER TABLE `vendor` MODIFY `phone` varchar(255) NULL
ALTER TABLE `vendor` MODIFY `email` varchar(255) NULL
ALTER TABLE `vendor` MODIFY `updatedAt` date NULL

UPDATE `vendor` set `updatedAt` = NULL  
ALTER TABLE `vendor` MODIFY `updatedAt` varchar(255) NULL
ALTER TABLE `user` MODIFY `dob` varchar(255) NULL
ALTER TABLE `maintenance_equipment` ADD model_no varchar(255) NULL

ALTER TABLE vendor 
ADD billing_address_line_1 varchar(255) NULL, 
ADD billing_city varchar(255) NULL,
ADD billing_state varchar(255) NULL,
ADD billing_country varchar(255) NULL, 
ADD billing_zip varchar(255) NULL,
ADD billing_email varchar(255) NULL,
ADD billing_phone varchar(255) NULL,
ADD business_name varchar(255) NULL,
ADD business_address_line_1 varchar(255) NULL,
ADD business_city varchar(255) NULL,
ADD business_state varchar(255) NULL,
ADD business_country varchar(255) NULL,
ADD business_zip varchar(255) NULL,
ADD business_email varchar(255) NULL,
ADD business_phone varchar(255) NULL,
ADD business_license varchar(255) NULL,
ADD business_license_exp date NULL,
ADD insurance_license varchar(255) NULL,
ADD insurance_license_exp date NULL,
ADD bond_docs varchar(255) NULL,
ADD bond_docs_exp date NULL,
ADD service_radius varchar(255) NULL

ALTER TABLE `maintenance_request_thread` ADD user_id int(11) NULL

CREATE TABLE `user_role` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `parent_id` int(11) NULL,
  `property_id` int(11) NULL,
  `name` varchar(255) NULL,
  `createdAt` date NULL
)

CREATE TABLE `user_module` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NULL,
  `createdAt` date NULL
)

CREATE TABLE `user_role_permission` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `user_role_id` int(11) NULL,
  `user_module_id` int(11) NULL,
  `list` int(11) NULL,
  `create` int(11) NULL,
  `read` int(11) NULL,
  `update` int(11) NULL,
  `delete` int(11) NULL,
  `createdAt` date NULL
)

ALTER TABLE `user` ADD user_role_id int(11) NULL
ALTER TABLE `user` ADD vendor_id int(11) NULL

-- 11272020
ALTER TABLE `document` ADD path varchar(255) NULL

-- 12032020
ALTER TABLE `user_role_permission` ADD permissions_json longtext NULL;
ALTER TABLE `user_module` ADD val varchar(255) NULL;
ALTER TABLE `user_role_permission`
DROP COLUMN `user_module_id`,
DROP COLUMN `list`,
DROP COLUMN `create`,
DROP COLUMN `read`,
DROP COLUMN `update`,
DROP COLUMN `delete`;
ALTER TABLE `user_role` ADD val varchar(255) NULL;
ALTER TABLE `user` ADD vendor_id int(11) NULL;
ALTER TABLE `maintenance_request` MODIFY `assigned_to` longtext NULL;
ALTER TABLE `maintenance_request` MODIFY `urgency` varchar(20) NULL;
ALTER TABLE `bill` ADD vendor_id int(11) NULL;
ALTER TABLE `bill` ADD invoice_no varchar(255) NULL;
ALTER TABLE `vendor` MODIFY category_id longtext NULL;

-- 12102020
ALTER TABLE `maintenance_request` ADD assigned_to_type int(11) NULL;
ALTER TABLE `maintenance_request_vendor` ADD is_seen int(11) NULL;

-- 12162020
ALTER TABLE `maintenance_request` ADD start_time time NULL;
ALTER TABLE `maintenance_request` ADD end_time time NULL;
ALTER TABLE `maintenance_request` ADD start_date date NULL;
-- ALTER TABLE `maintenance_request` ADD end_date date NULL;
CREATE TABLE `maintenance_request_dt` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `maintenance_request_id` int(11) NULL,
  `start_date` date NULL,
  `start_time` time NULL,
  `end_time` time NULL,
  `createdAt` date NULL,
  `updatedAt` date NULL,
  `deletedAt` date NULL
)

--12222020
ALTER TABLE `maintenance_request_thread` ADD `timeCreated` time NULL
ALTER TABLE `maintenance_request` ADD `eta_dt` DATETIME NULL
ALTER TABLE `maintenance_request` ADD `notes` TEXT NULL
ALTER TABLE `maintenance_request_thread` DROP COLUMN `timeCreated`
ALTER TABLE `maintenance_request_thread` MODIFY `createdAt` DATETIME NULL

-- 15012021
ALTER TABLE `maintenance_request` ADD `request_no` varchar(255) DEFAULT NULL;
ALTER TABLE `maintenance_request` ADD `request_to` longtext DEFAULT NULL;
ALTER TABLE `maintenance_request` ADD `issued_by_id` int(11) DEFAULT NULL;
ALTER TABLE `maintenance_request` ADD `issued_date` DATETIME DEFAULT NULL;
ALTER TABLE `maintenance_request` ADD `send_questions_by` DATETIME DEFAULT NULL;
ALTER TABLE `maintenance_request` ADD `decision_by` DATETIME DEFAULT NULL;
ALTER TABLE `maintenance_request` ADD `subject` text DEFAULT NULL;
ALTER TABLE `maintenance_request` ADD `overview` text DEFAULT NULL;
ALTER TABLE `maintenance_request` ADD `scope` text DEFAULT NULL;
CREATE TABLE `maintenance_order` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `image_filename` varchar(255) DEFAULT NULL,
  `unit_resident_id` int(11) DEFAULT NULL,
  `createdAt` date NOT NULL,
  `m_request_status_id` int(11) NOT NULL,
  `updatedAt` date DEFAULT NULL,
  `resolved_date` date DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `maintenance_type_id` int(11) NOT NULL,
  `urgency` varchar(20) DEFAULT NULL,
  `m_type_other_value` varchar(255) DEFAULT NULL,
  `assigned_to` longtext DEFAULT NULL,
  `rfp_type` varchar(10) DEFAULT NULL,
  `vendor_category_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `is_seen` tinyint(1) DEFAULT 0,
  `property_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `assigned_to_type` int(11) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `eta_dt` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `request_no` varchar(255) DEFAULT NULL,
  `overview` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `request_to` longtext DEFAULT NULL
)
ALTER TABLE `maintenance_equipment` ADD category_id int(11) NULL;
ALTER TABLE `maintenance_equipment` ADD frequency_id int(11) NULL;
ALTER TABLE `maintenance_equipment` ADD components text NULL;
CREATE TABLE `vendor_invite` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `email` text DEFAULT NULL,
  `property_id` int(11) DEFAULT NULL,
  `tokenInvitation` text DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL
)
CREATE TABLE `maintenance_part` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `device_name` text DEFAULT NULL,
  `service_reminders` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  `components` longtext DEFAULT NULL,
  `files` text DEFAULT NULL,
  `serviced_by` text DEFAULT NULL,
  `mobile_no` text DEFAULT NULL,
  `part_no` text DEFAULT NULL,
  `unit_price` text DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `location_description` text DEFAULT NULL,
  `longtitude` text DEFAULT NULL,
  `latitude` text DEFAULT NULL,
  `input_location` text DEFAULT NULL,
  `warranty_start` date DEFAULT NULL,
  `warranty_end` date DEFAULT NULL,
  `standard_warranty` text DEFAULT NULL,
  `extended_warranty` text DEFAULT NULL,
  `expiration_reminder` text DEFAULT NULL,
  `reminder_type` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `deletedAt` date DEFAULT NULL,
  `model_no` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `frequency_id` int(11) DEFAULT NULL
)

--01232021
CREATE TABLE `notification_repeat` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `notification_id` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `isRecurring` int(11) DEFAULT NULL,
  `weekly` text DEFAULT NULL,  
  `repeat_type`int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
)

--02022021
ALTER TABLE `unit_user` ADD user_id int(11) NULL;
ALTER TABLE `pmc` ADD `classification` TEXT NULL;
ALTER TABLE `pmc` ADD `email` TEXT NULL;

ALTER TABLE `user` ADD emergency_contact_name TEXT NULL
ALTER TABLE `user` ADD relation TEXT NULL
ALTER TABLE `user` ADD emergency_contact_no TEXT NULL
ALTER TABLE `user` ADD pmc_id int(11) NULL

ALTER TABLE `user` ADD phone_1_area TEXT NULL;
ALTER TABLE `user` ADD phone_1_type TEXT NULL;
ALTER TABLE `user` ADD phone_2_area TEXT NULL;
ALTER TABLE `user` ADD phone_2_type TEXT NULL;
ALTER TABLE `user` ADD caliber_contact_id int(11) NULL;

--02112021
ALTER TABLE `property` ADD caliber_client_id int(11) NULL
ALTER TABLE `property` ADD BillingAddress1 TEXT NULL;
ALTER TABLE `property` ADD BillingAddress2 TEXT NULL;
ALTER TABLE `property` ADD BillingAddress3 TEXT NULL;
ALTER TABLE `property` ADD BillingCity TEXT NULL;
ALTER TABLE `property` ADD BillingCountry TEXT NULL;
ALTER TABLE `property` ADD BillingFax TEXT NULL;
ALTER TABLE `property` ADD BillingPhoneArea TEXT NULL;
ALTER TABLE `property` ADD BillingPhone TEXT NULL;
ALTER TABLE `property` ADD BillingPhoneType TEXT NULL;
ALTER TABLE `property` ADD BillingState TEXT NULL;
ALTER TABLE `property` ADD BillingZip TEXT NULL;

--02182021
ALTER TABLE `user_role` ADD access_level int(11) NULL
ALTER TABLE `user_role` ADD description TEXT NULL
ALTER TABLE `user_role` ADD pmc_id int(11) NULL

ALTER TABLE `amenity` ADD booking_limit int(11) NULL
ALTER TABLE `amenity` ADD booking_limit_unit int(11) NULL

--02242021
CREATE TABLE `amenity_time` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `val` text DEFAULT NULL
)
CREATE TABLE `freq` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `val` text DEFAULT NULL
)
CREATE TABLE `work_week` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `val` text DEFAULT NULL
)

ALTER TABLE `amenity_reservation` ADD startDate DATETIME NULL;
ALTER TABLE `amenity_reservation` ADD endDate DATETIME NULL;
ALTER TABLE `amenity_reservation` ADD title TEXT NULL;
ALTER TABLE `amenity_reservation` ADD label TEXT NULL;
ALTER TABLE `amenity_reservation` ADD classes TEXT NULL;
ALTER TABLE `amenity_reservation` MODIFY `startDate` DATE NULL;
ALTER TABLE `unit_resident` ADD role_id int(11) NULL;
ALTER TABLE `amenity` ADD notification_message_id int(11) NULL;
ALTER TABLE `amenity_reservation` MODIFY `from_time` varchar(7) NULL;
ALTER TABLE `amenity_reservation` MODIFY `to_time` varchar(7) NULL;

--03052021
ALTER TABLE `amenity_reservation` ADD style TEXT NULL;
ALTER TABLE `amenity` ADD amenity_f_color TEXT NULL;
ALTER TABLE `amenity_reservation` MODIFY `updatedAt` datetime NULL;
ALTER TABLE `amenity_reservation` MODIFY `startDate` datetime NULL;
ALTER TABLE `amenity_reservation` ADD is_block int(1) NULL;
ALTER TABLE `amenity_reservation` ADD block_reason TEXT NULL;
ALTER TABLE `amenity_reservation` ADD is_buffer int(1) NULL;
CREATE TABLE `amenity_reservation_detail` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `amenity_reservation_id` text DEFAULT NULL,
  `amenity_id` int(11) NULL,
  `property_id` int(11) NULL,
  `from_time` varchar(7) NULL,
  `to_time` varchar(7) NULL,
  `from_date` date NULL,
  `to_date` date NULL
)

--03262021
ALTER TABLE `maintenance_order` ADD `vendor_email` text DEFAULT NULL;
ALTER TABLE `maintenance_order` ADD `direction` text DEFAULT NULL;