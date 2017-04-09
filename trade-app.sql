-- phpMyAdmin SQL Dump
-- version 4.0.10.10
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 09 2017 г., 23:49
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=46 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Дамп данных таблицы `instruments`
--

INSERT INTO `instruments` (`id`, `name`, `price`, `interest`, `status`) VALUES
(12, 'RUSS 3.25%', 102, 0, 1),
(13, 'RUSS 1.75%', 108, 0, 0),
(14, 'RUSS 4.400', 116, 0, 0),
(15, 'CAD 38', 124, 0, 0),
(16, 'CAD 39 \\/4', 104, 0, 0),
(17, 'CAD \\/19.4', 104, 0, 1),
(18, 'RUSS 2.17%', 133, 0, 1),
(19, 'CAD \\/34', 105.2, 0, 1),
(20, 'RUSS /13', 103.2, 0, 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=27 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Дамп данных таблицы `sessions`
--

INSERT INTO `sessions` (`id`, `start`, `end`, `status`, `instrument_ids`, `interested_instruments`, `dealed_instruments`) VALUES
(5, '2017-04-09 22:20:00', '2017-04-09 22:29:00', 0, 'a:4:{i:0;i:12;i:1;i:13;i:2;i:14;i:3;i:16;}', 'a:0:{}', 'a:0:{}'),
(6, '2017-04-09 22:50:00', '2017-04-09 23:20:00', 0, 'a:4:{i:0;i:12;i:1;i:17;i:2;i:18;i:3;i:19;}', 'a:0:{}', 'a:0:{}');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `user_name`, `user_pass`, `token`, `role_id`, `fio`, `organization`, `phone`, `comment`) VALUES
(2, 'user@mail.ru', 'ee11cbb19052e40b07aac0ca060c23ee', '69d00438fa0911cf832e63fb1231d2df', 2, 'Павел Рукавишников', 'planb', '8939393', 'suck my ass'),
(3, 'admin@mail.ru', '21232f297a57a5a743894a0e4a801fc3', 'c8663988a7c15d2c5d2cfb054c82c4ad', 1, 'Павел Рукавишников', 'planb', '8939393', 'suck my ass'),
(4, 'user2@mail.ru', '7e58d63b60197ceb55a1c487989a3720', '', 2, 'Павел Рукавишников', 'planb', '8939393', 'suck my ass');

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
