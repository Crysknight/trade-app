-- phpMyAdmin SQL Dump
-- version 4.0.10.10
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 06 2017 г., 18:09
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
  PRIMARY KEY (`id`),
  KEY `instrument_id` (`instrument_id`),
  KEY `session_id` (`session_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=40 ;

--
-- Дамп данных таблицы `deals`
--

INSERT INTO `deals` (`id`, `saled`, `buyed`, `seller`, `buyer`, `seller_remainder`, `buyer_remainder`, `instrument_id`, `session_id`, `seller_order_id`, `buyer_order_id`) VALUES
(31, 25, 25, 4, 2, 0, 75, 8, 17, 58, 57),
(32, 25, 25, 2, 4, 75, 0, 8, 17, 56, 59),
(33, 25, 25, 4, 2, 0, 50, 8, 17, 60, 57),
(34, 25, 25, 2, 4, 50, 0, 8, 17, 56, 61),
(35, 25, 25, 4, 2, 0, 25, 8, 17, 62, 57),
(36, 25, 25, 2, 4, 25, 0, 8, 17, 56, 63),
(37, 25, 25, 4, 2, 0, 0, 8, 17, 64, 57),
(38, 25, 25, 2, 4, 0, 0, 8, 17, 56, 65),
(39, 25, 25, 2, 3, 25, 0, 13, 17, 70, 71);

-- --------------------------------------------------------

--
-- Структура таблицы `instruments`
--

CREATE TABLE IF NOT EXISTS `instruments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `price` int(11) NOT NULL,
  `interest` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- Дамп данных таблицы `instruments`
--

INSERT INTO `instruments` (`id`, `name`, `price`, `interest`, `status`) VALUES
(6, 'RUSS 3.25%', 100, 1, 0),
(7, 'RUSS 1.75%', 110, 0, 0),
(8, 'CAD 0.03% ', 115, 9, 0),
(9, 'Ruby 8 /20', 117, 0, 0),
(10, 'RUSS 1.75%', 114, 0, 0),
(11, 'dlfaksjd', 100, 0, 0),
(12, 'RUSS 3.25%', 101, 0, 0),
(13, 'Rubyd 8 /2', 117, 2, 1),
(14, 'RUSST 1.75', 115, 0, 0),
(15, 'RUSS 3.25%', 101, 0, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=74 ;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `type`, `user_id`, `quantity`, `instrument_id`, `session_id`) VALUES
(70, 'sale', 2, 25, 13, 17),
(72, 'sale', 2, 25, 8, 17),
(73, 'sale', 3, 25, 13, 17);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ;

--
-- Дамп данных таблицы `sessions`
--

INSERT INTO `sessions` (`id`, `start`, `end`, `status`, `instrument_ids`) VALUES
(17, '2017-04-06 10:00:00', '2017-04-06 21:00:00', 2, 'a:4:{i:0;i:8;i:1;i:13;i:2;i:14;i:3;i:15;}');

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `user_name`, `user_pass`, `token`, `role_id`) VALUES
(2, 'user@mail.ru', 'ee11cbb19052e40b07aac0ca060c23ee', '6a00c26506c8b10e993a01813728a1c4', 2),
(3, 'admin@mail.ru', '21232f297a57a5a743894a0e4a801fc3', 'fce0c3c53e84ad15c6b6380c9642a47e', 1),
(4, 'user2@mail.ru', '7e58d63b60197ceb55a1c487989a3720', '247750a20cdea7471aeb7b5d0ae48bf1', 2);

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
