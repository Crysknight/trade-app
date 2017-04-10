-- phpMyAdmin SQL Dump
-- version 4.0.10.10
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 10 2017 г., 17:27
-- Версия сервера: 5.5.45
-- Версия PHP: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `trade-app`
--

-- --------------------------------------------------------

--
-- Структура таблицы `deals`
--

CREATE TABLE IF NOT EXISTS `deals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `saled` int(11) DEFAULT NULL,
  `buyed` int(11) DEFAULT NULL,
  `seller` int(11) DEFAULT NULL,
  `buyer` int(11) DEFAULT NULL,
  `seller_remainder` int(11) DEFAULT NULL,
  `buyer_remainder` int(11) DEFAULT NULL,
  `instrument_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `seller_order_id` int(11) NOT NULL,
  `buyer_order_id` int(11) NOT NULL,
  `deal_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `instrument_id` (`instrument_id`),
  KEY `session_id` (`session_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=48 ;

--
-- Дамп данных таблицы `deals`
--

INSERT INTO `deals` (`id`, `saled`, `buyed`, `seller`, `buyer`, `seller_remainder`, `buyer_remainder`, `instrument_id`, `session_id`, `seller_order_id`, `buyer_order_id`, `deal_date`) VALUES
(47, 25, 25, 3, 4, 25, 0, 24, 11, 31, 32, '2017-04-10 12:07:10');

-- --------------------------------------------------------

--
-- Структура таблицы `instruments`
--

CREATE TABLE IF NOT EXISTS `instruments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` float NOT NULL,
  `interest` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=29 ;

--
-- Дамп данных таблицы `instruments`
--

INSERT INTO `instruments` (`id`, `name`, `price`, `interest`, `status`) VALUES
(24, 'RUSS 17% /17', 103.4, 0, 0),
(25, 'CAD 19 /70', 103.55, 0, 1),
(26, 'G 300.30', 112.3, 2, 1),
(27, 'Digger', 10.21, 0, 1),
(28, 'RUSS 14% /17', 103.4, 0, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `instrument_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=34 ;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `type`, `user_id`, `quantity`, `instrument_id`, `session_id`) VALUES
(31, 'sale', 3, 25, 24, 11),
(33, 'buy', 4, 25, 25, 11);

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Структура таблицы `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `status` int(5) NOT NULL,
  `instrument_ids` text,
  `interested_instruments` text NOT NULL,
  `dealed_instruments` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Дамп данных таблицы `sessions`
--

INSERT INTO `sessions` (`id`, `start`, `end`, `status`, `instrument_ids`, `interested_instruments`, `dealed_instruments`) VALUES
(11, '2017-04-10 12:00:00', '2017-04-10 12:07:00', 0, 'a:2:{i:0;i:24;i:1;i:25;}', 'a:1:{i:0;a:5:{s:2:"id";s:2:"25";s:4:"name";s:10:"CAD 19 /70";s:5:"price";s:6:"103.55";s:8:"interest";s:1:"1";s:6:"status";s:1:"1";}}', 'a:1:{i:0;a:5:{s:2:"id";s:2:"24";s:4:"name";s:12:"RUSS 17% /17";s:5:"price";s:5:"103.4";s:8:"interest";s:1:"2";s:6:"status";s:1:"1";}}'),
(12, '2017-04-10 10:00:00', '2017-04-10 12:00:00', 0, 'a:4:{i:0;i:24;i:1;i:25;i:2;i:26;i:3;i:27;}', 'a:0:{}', 'a:0:{}');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `fio` varchar(20) NOT NULL,
  `organization` varchar(30) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `comment` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `user_name`, `user_pass`, `token`, `role_id`, `fio`, `organization`, `phone`, `comment`) VALUES
(3, 'admin@mail.ru', '21232f297a57a5a743894a0e4a801fc3', '26b2601b4e7afb10fc1b17b19a11e1ec', 1, 'Павел Рукавишников', 'planb', '8939393', 'hello'),
(4, 'user@mail.ru', '7e58d63b60197ceb55a1c487989a3720', '4b1bd56beef5c196a33cfc7a8c217396', 2, 'Павел Рукавишников', 'planb', '8939393', 'asdfasdf'),
(5, 'monomach@mail.ru', 'e1a6be06be3ac48affe3af2198bc86a4', '', 2, 'Владимир Мономах', 'Русь', '304857034', 'Царь');

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `deals`
--
ALTER TABLE `deals`
  ADD CONSTRAINT `deals_ibfk_1` FOREIGN KEY (`instrument_id`) REFERENCES `instruments` (`id`),
  ADD CONSTRAINT `deals_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`);

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
